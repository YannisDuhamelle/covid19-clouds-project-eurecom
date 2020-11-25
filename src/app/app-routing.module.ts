import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountryComponent } from './country/country.component';

import { WorldwideSummaryComponent } from './worldwide-summary/worldwide-summary.component';

const routes: Routes = [
  { path: "", pathMatch: "full", component: WorldwideSummaryComponent },
  { path: "country/:name", component: CountryComponent},
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
