import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { CodePromise } from '@polkadot/api-contract';
import { ContractModel } from 'src/app/models/contract.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContractUploaderService {

  constructor(
    private appSettings: AppSettings
  ) { }

  wsProvider = new WsProvider(this.appSettings.wsProviderEndpoint);
  api = ApiPromise.create({ provider: this.wsProvider });
  keypair = this.appSettings.keypair;

  uploadEventMessages = new Subject<any>();

  async upload(contract: ContractModel): Promise<void> {
    const api = await this.api;

    const code = new CodePromise(api, contract.metadata, contract.wasm);
    const options = { storageDepositLimit: null, gasLimit: 100000n * 1000000n };
    
    const salt = new Uint8Array();
    api.registry.createType('Balance', 1000);

    let address;
    let message = "";

    await code.tx['new'](options, ...contract.params[Symbol.iterator]()).signAndSend(
      this.keypair, (result: any) => {
        message = 'Transaction status: ' + result.status.type;
        this.uploadEventMessages.next({ message: message, isFinalized: false, hasError: false });

        if (result.status.isInBlock) {
          message = 'Included at block hash\r\n' + result.status.asInBlock.toHex() + "\r\n\nFinalizing...";
          this.uploadEventMessages.next({ message: message, isFinalized: false, hasError: false });
        }

        if (result.status.isFinalized) {
          message = 'Finalized block hash ' + result.status.asFinalized.toHex();
          this.uploadEventMessages.next({ message: message, isFinalized: true, hasError: false });

          address = result.contract.address.toString();
        }
      }
    );
  }
}
