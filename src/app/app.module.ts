import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppFlexModule } from './flex';
import { LineClampDirective } from './core/line-clamp.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'ngx-avatar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
    declarations: [AppComponent, LineClampDirective],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppFlexModule,
        FormsModule,
        ReactiveFormsModule,
        AvatarModule,
        BrowserAnimationsModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        MatSelectModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
