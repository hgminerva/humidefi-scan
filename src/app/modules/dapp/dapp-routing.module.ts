import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DappComponent } from './dapp.component';

const routes: Routes = [
  {
    path: '',
    component: DappComponent,
    children: [
      { path: '', component: DappComponent },
      { path: 'scan', component: DappComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DappRoutingModule { }
