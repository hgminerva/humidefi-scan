import { Component, OnInit } from '@angular/core';
import { AccountTransactionModel } from 'src/app/models/account-transaction.model';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  constructor() { }

  accountTransactionList: AccountTransactionModel[] = [
    {
      hash: '0x1232211222',
      method: 'Mint',
      block: '123,2321',
      age: '1hr',
      from: '0xb221212',
      to: '0xb22121',
      value: '',
      fee: '',
    },
  ];

  ngOnInit(): void {
  }

}
