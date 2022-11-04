import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
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

  public searchClick(accountAddress: string) {
    this.scanService.getAccountBalance(accountAddress).then(balance => {
      this.umiBalance = balance;
    })

    this.scanService.getAccountDetail(accountAddress);
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
