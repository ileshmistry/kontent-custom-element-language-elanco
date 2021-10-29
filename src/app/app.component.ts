import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { IManagementClient, ManagementClient } from '@kentico/kontent-management';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CoreComponent } from './core/core.component';
import { KontentService } from './services/kontent.service';
import { ILanguage, ManagementService } from './services/management.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent extends CoreComponent implements OnInit, AfterViewChecked {
    // config
    public projectId?: string;
    public managementApiKey?: string;

    // base
    public loading: boolean = false;
    public errorMessage?: string;

    // languages
    public languages: ILanguage[] = [];
    public selectedLanguage?: ILanguage;

    private client?: ManagementClient;

    constructor(
        private managementService: ManagementService,
        private kontentService: KontentService,
        cdr: ChangeDetectorRef
    ) {
        super(cdr);
    }

    ngOnInit(): void {
        if (this.isKontentContext()) {
            this.kontentService.initCustomElement(
                (data) => {
                    this.projectId = data.projectId;
                    this.managementApiKey = data.apiKey;
                    data.projectId

                    this.client = this.getManagementClient(this.projectId, this.managementApiKey);

                    if (this.client) {
                        this.initLanguages(this.client);
                    }
                },
                (error) => {
                    console.error(error);
                    this.errorMessage = `Could not initialize custom element. Custom elements can only be embedded in an iframe`;
                    super.detectChanges();
                }
            );
        } else {
            this.projectId = this.getDefaultProjectId();
            this.managementApiKey = this.getDefaultManagementApiKey();

            this.client = this.getManagementClient(this.projectId, this.managementApiKey);

            if (this.client) {
                this.initLanguages(this.client);
            }
        }
    }

    ngAfterViewChecked(): void {
        // update size of Kontent UI
        if (this.isKontentContext()) {
            // this is required because otherwise the offsetHeight can return 0 in some circumstances
            // https://stackoverflow.com/questions/294250/how-do-i-retrieve-an-html-elements-actual-width-and-height
            setTimeout(() => {
                const htmlElement = document.getElementById('htmlElem');
                if (htmlElement) {
                    const height = htmlElement.offsetHeight;
                    this.kontentService.updateSizeToMatchHtml(height);
                }
            }, 50);
        }
    }

    private initLanguages(client: ManagementClient): void {
        super.subscribeToObservable(
            this.managementService.getLanguages(client).pipe(
                map((languages) => {
                    this.languages = languages;

                    super.markForCheck();
                })
            )
        );
    }

    private getManagementClient(projectId?: string, apiKey?: string): ManagementClient | undefined {
        if (projectId && apiKey) {
            return new ManagementClient({
                projectId: projectId,
                apiKey: apiKey
            });
        }

        return undefined;
    }

    private getDefaultManagementApiKey(): string | undefined {
        if (this.isKontentContext()) {
            return undefined;
        }

        return environment.kontent.apiKey;
    }

    private getDefaultProjectId(): string | undefined {
        if (this.isKontentContext()) {
            return undefined;
        }

        return environment.kontent.projectId;
    }

    private isKontentContext(): boolean {
        return environment.production;
    }
}
