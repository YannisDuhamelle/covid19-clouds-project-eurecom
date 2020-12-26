import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';

import { environment } from 'src/environments/environment';
import { WorldwideSummaryComponent } from './worldwide-summary/worldwide-summary.component';
import { CountryComponent } from './country/country.component';
import { SigninComponent } from './signin/signin.component';
import { AddNewsComponent } from './add-news/add-news.component';

@NgModule({
  declarations: [
    AppComponent,
    WorldwideSummaryComponent,
    CountryComponent,
    SigninComponent,
    AddNewsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    HttpClientModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
