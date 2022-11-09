import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ScanService } from 'src/app/services/scan/scan.service';

@Component({
  selector: 'app-balance-info',
  templateUrl: './balance-info.component.html',
  styleUrls: ['./balance-info.component.scss']
})
export class BalanceInfoComponent implements OnInit {

  constructor(
    private scanService: ScanService,
    private decimalPipe: DecimalPipe
  ) { }

  accountAddress: string = '';
  umiBalance: string = '0.00000';
  phpUBalance: string = '0.00000';

  async getChainDexBalance(accountAddress: string) {
    let keypair = await this.scanService.generateKeypair(accountAddress);
    let chainDexBalance: Promise<string> = this.scanService.getChainDexBalance(keypair);

    this.umiBalance = this.decimalPipe.transform((await chainDexBalance), "1.5-5") || "0.00000";
  }

  async getPhpuContractPsp22BalanceOf(accountAddress: string) {
    let keypair = await this.scanService.generateKeypair(accountAddress);
    let phpuContractBalance = await this.scanService.getPhpuContractPsp22BalanceOf(keypair);

    this.phpUBalance = this.decimalPipe.transform((phpuContractBalance), "1.5-5") || "0.00000";
  }

  searchClick(): void {
    this.getChainDexBalance(this.accountAddress);
    this.getPhpuContractPsp22BalanceOf(this.accountAddress);
  }

  ngOnInit(): void {
  }
}
