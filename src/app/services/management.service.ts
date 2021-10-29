import { Injectable } from '@angular/core';
import { ManagementClient } from '@kentico/kontent-management';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface ILanguage {
    codename: string;
    name: string;
}

@Injectable({ providedIn: 'root' })
export class ManagementService {
    constructor() {}

    getLanguages(client: ManagementClient): Observable<ILanguage[]> {
        return from(client.listLanguages().toAllPromise()).pipe(
            map((response) => {
                return response.data.items.map((m) => {
                    const language: ILanguage = {
                        codename: m.codename,
                        name: m.name
                    };

                    return language;
                });
            })
        );
    }

    copyFromLanguageRecursive(data: {
        client: ManagementClient;
        fromLanguage: ILanguage;
        toLanguage: ILanguage;
        contentItemCodename: string;
    }): Observable<void> {
        return {} as any;
    }
}
