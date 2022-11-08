import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DappComponent } from './dapp.component';
import { ScanComponent } from './scan/scan.component';
import { ContractComponent } from './contract/contract.component';
import { BlocksComponent } from './blocks/blocks.component';

const routes: Routes = [
  {
    path: '',
    component: DappComponent,
    children: [
      { path: '', component: ScanComponent },
      { path: 'scan', component: ScanComponent },
      { path: 'blocks', component: BlocksComponent },
      { path: 'contract', component: ContractComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DappRoutingModule { }
