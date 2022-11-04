import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DappRoutingModule } from './dapp-routing.module';
import { LayoutModule } from '../layout/layout.module';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';

import { DappComponent } from './dapp.component';
import { ScanComponent } from './scan/scan.component';
import { ContractComponent } from './contract/contract.component';
import { BalanceInfoComponent } from './balance-info/balance-info.component';
import { TransactionsComponent } from './transactions/transactions.component';

@NgModule({
  declarations: [
    DappComponent,
    ScanComponent,
    ContractComponent,
    BalanceInfoComponent,
    TransactionsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DappRoutingModule,
    LayoutModule,
    CardModule,
    ButtonModule,
    TableModule,
    DropdownModule,
    InputTextModule,
    DialogModule,
    ProgressSpinnerModule,
    TabViewModule,
    ToastModule,
    MessagesModule,
    MessageModule,
    InputNumberModule,
    FileUploadModule
  ]
})
export class DappModule { }
