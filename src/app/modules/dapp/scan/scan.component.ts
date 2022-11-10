import { Component, OnInit, ViewChild } from '@angular/core';
import { TransactionsComponent } from '../transactions/transactions.component';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss']
})
export class ScanComponent implements OnInit {
  @ViewChild(TransactionsComponent) transactionsComponent: any;

  constructor() { }

  filterTransactions(event: any): void {
    let address: string = event;
    this.transactionsComponent.searchTransactionsByAddress(address);
  }

  ngOnInit(): void {
  }
}