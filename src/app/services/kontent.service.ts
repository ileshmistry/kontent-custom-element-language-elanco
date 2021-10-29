import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

declare const CustomElement: any;

interface IElementInit {
    isDisabled: boolean;
    value?: string;
    apiKey?: string;
    projectId?: string;
}

@Injectable({ providedIn: 'root' })
export class KontentService {
    public disabledChanged = new Subject<boolean>();
    private initialized: boolean = false;

    constructor() {}

    initCustomElement(onInit: (data: IElementInit) => void, onError: (error: any) => void): void {
        try {
            CustomElement.init((element: any, context: any) => {
                CustomElement.onDisabledChanged((disabled: boolean) => {
                    this.disabledChanged.next(disabled);
                });

                console.log('context', context);

                onInit({
                    value: element.value,
                    isDisabled: element.disabled,
                    apiKey: element.config.apiKey,
                    projectId: element.config.projectId
                });

                this.initialized = true;
            });
        } catch (error) {
            onError(error);
        }
    }

    updateSizeToMatchHtml(height: number): void {
        if (this.initialized) {
            CustomElement.setHeight(height);
        }
    }
}
