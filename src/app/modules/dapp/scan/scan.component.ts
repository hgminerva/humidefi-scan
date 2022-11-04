import { Component, OnInit, ViewChild } from '@angular/core';
import { BalanceInfoComponent } from '../balance-info/balance-info.component';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss']
})
export class ScanComponent implements OnInit {
  @ViewChild(BalanceInfoComponent) balanceInfoComponent: any;

  constructor() { }

  searchAddressInput: string = '';
  accountAddress: string = '';

  searchClick() {
    this.searchAddressInput = this.accountAddress;
    this.balanceInfoComponent.searchClick(this.accountAddress);
  }

  ngOnInit(): void {
  }
}