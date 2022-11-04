import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { AccountTransactionModel } from 'src/app/models/account-transaction.model';
import { PhpuContractService } from 'src/app/services/phpu-contract/phpu-contract.service';
import { ScanService } from 'src/app/services/scan/scan.service';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss']
})
export class ScanComponent implements OnInit {

  constructor() { }

  searchAddressInput: string = '';
  accountAddress: string = '';

  searchClick() {
    this.searchAddressInput = this.accountAddress;
  }

  ngOnInit(): void {
  }
}