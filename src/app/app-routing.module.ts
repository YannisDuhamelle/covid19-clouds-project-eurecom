import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddNewsComponent } from './add-news/add-news.component';
import { CountryComponent } from './country/country.component';
import { SigninComponent } from './signin/signin.component';

import { WorldwideSummaryComponent } from './worldwide-summary/worldwide-summary.component';

const routes: Routes = [
  { path: "", pathMatch: "full", component: WorldwideSummaryComponent },
  { path: "country/:name", component: CountryComponent },
  { path: "signin", component: SigninComponent },
  { path: "add-news", component: AddNewsComponent },
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
