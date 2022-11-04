import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { AccountTransactionModel } from 'src/app/models/account-transaction.model';
import { PhpuContractService } from 'src/app/services/phpu-contract/phpu-contract.service';
import { ScanService } from 'src/app/services/scan/scan.service';

@Component({
  selector: 'app-balance-info',
  templateUrl: './balance-info.component.html',
  styleUrls: ['./balance-info.component.scss']
})
export class BalanceInfoComponent implements OnInit {

  constructor(
    private scanService: ScanService,
    private appSetting: AppSettings,
    private phpuContractService: PhpuContractService,
    private decimalPipe: DecimalPipe
  ) { }

  umiBalance: string = '0';
  phpUBalance: number = 0;
  accountAddress: string = '';

  searchClick() {
    this.scanService.getAccountBalance(this.accountAddress).then(balance => {
      this.umiBalance = balance;
      console.log(balance)
    })

    this.scanService.getAccountDetail(this.accountAddress);
  }

  async getDexPHPUBalance() {
    let keypair = this.appSetting.dexAccount;
    let phpuContractBalance = await this.phpuContractService.psp22BalanceOf(keypair);

    let balance = parseFloat((this.decimalPipe.transform(phpuContractBalance, "1.5-5") || "0").replace(/,/g, ''));
    this.phpUBalance = balance;
  }

  ngOnInit(): void {
  }

}
