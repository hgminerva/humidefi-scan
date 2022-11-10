import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AccountTransactionModel } from 'src/app/models/account-transaction.model';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  constructor(
    private transactionsService: TransactionsService,
    public decimalPipe: DecimalPipe
  ) { }

  showTransactionDetailsDialog: boolean = false;
  currentTransactionData: AccountTransactionModel = new AccountTransactionModel();
  accountTransactionList: AccountTransactionModel[] = [];

  // accountTransactionList: AccountTransactionModel[] = [{
  //   hash: '0xb96dbaa7a11afa26ba545f8f88e94c32c398b464657a3bf72129998fc1f576cf',
  //   method: 'Withdraw',
  //   blocks: '758',
  //   age: '0',
  //   from: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
  //   to: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
  //   value: '1,482,244,295',
  //   fee: '0'
  // }];

  async getTransactions(): Promise<void> {
    let transactions: Promise<AccountTransactionModel[]> = this.transactionsService.getTransactions();
    this.accountTransactionList = await transactions;
  }

  async searchTransactionsByAddress(address: string): Promise<void> {
    let transactions: Promise<AccountTransactionModel[]> = this.transactionsService.getTransactions();
    let transactionList = (await transactions).filter(d =>
      d.from.includes(address) || d.to.includes(address)
    );

    if (address != '') {
      this.accountTransactionList = transactionList;
    } else {
      this.accountTransactionList = await transactions;
    }
  }

  viewTransactionDetails(data: AccountTransactionModel): void {
    this.showTransactionDetailsDialog = true;
    this.currentTransactionData = data;
  }

  ngOnInit(): void {
    this.getTransactions();
  }
}
