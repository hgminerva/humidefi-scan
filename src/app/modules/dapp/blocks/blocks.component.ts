import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BlockService } from 'src/app/services/block/block.service';
import { BalanceInfoComponent } from '../balance-info/balance-info.component';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.scss']
})
export class BlocksComponent implements OnInit {
  @ViewChild(BalanceInfoComponent) balanceInfoComponent: any;

  constructor(
    private blockService: BlockService,
    private datepipe: DatePipe
  ) { }

  blocks: any[] = [];
  blocksArray: any[] = [];
  currentBlock: any = {};
  showBlockDetailsDialog: boolean = false;

  selectedNetwork: string = '';
  networks: any[] = [{
    name: 'Testnet',
    endPoint: ''
  }];

  networkOnChange(event: Event): void {
    console.log(event);
  }

  async getBlocks(): Promise<void> {
    let blocks: Promise<any> = this.blockService.blocks();
    this.blocks = (await blocks);
  }

  padTo2Digits(num: any) {
    return num.toString().padStart(2, '0');
  }

  convertMsToTime(milliseconds: any) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    // 👇️ If you don't want to roll hours over, e.g. 24 to 00
    // 👇️ comment (or remove) the line below
    // commenting next line gets you `24:00:00` instead of `00:00:00`
    // or `36:15:31` instead of `12:15:31`, etc.
    hours = hours % 24;
    let date_now = this.datepipe.transform(new Date(), 'yyyy-MM-dd');

    return `${date_now} ${this.padTo2Digits(hours)}:${this.padTo2Digits(minutes)}:${this.padTo2Digits(
      seconds,
    )}`;
  }

  getSubstring(str: string) {
    let first = str.substring(0, 4);
    let last = str.substring(str.length - 3, str.length);
    return first + '...' + last;
  }

  viewBlockDetails(block: any): void {
    this.currentBlock = block;
    this.showBlockDetailsDialog = true;
  }

  getExtrinsincs(extrinsicsArray: any[]): string {
    let extrinsics: string = "";

    if (extrinsicsArray != null) {
      if (extrinsicsArray.length > 0) {
        for (let i = 0; i < extrinsicsArray.length; i++) {
          extrinsics += extrinsicsArray[i].extrinsic + '\n';
        }
      }
    }

    return extrinsics;
  }

  formatDate(date: any) {
    let _date: Date = new Date(date);
    let current_date: Date = new Date();

    let message_date = this.datepipe.transform(_date, 'yyyy-MM-dd');
    let date_now = this.datepipe.transform(new Date(), 'yyyy-MM-dd');

    if (message_date == date_now) {
      let milliseconds = (current_date.getTime() - _date.getTime());

      let hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
      let minutes = Math.floor((milliseconds / (1000 * 60)) % 60);

      return (hours == 0 ? '' : hours + " Hours ") + minutes + " Minutes ";
    } else {
      let milliseconds = (current_date.getTime() - _date.getTime());
      let hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

      if (hours > 24 && hours < 48) {
        return "Yesterday";
      } else {
        if (_date.getFullYear() < current_date.getFullYear()) {
          return _date.getFullYear().toString() + " Year";
        } else {
          return _date.getMonth() + " Month " + _date.getDay() + " Day";
        }
      }
    }
  }

  ngOnInit(): void {
    this.getBlocks();
  }
}
