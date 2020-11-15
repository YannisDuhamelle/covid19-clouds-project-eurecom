import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorldwideSummaryComponent } from './worldwide-summary/worldwide-summary.component';

const routes: Routes = [
  { path: "", pathMatch: "full", component: WorldwideSummaryComponent },
  { path: "**", redirectTo: "signin" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
