import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { ApiPromise, Keyring, WsProvider } from '@polkadot/api';
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

  uploadEventMessages = new Subject<any>();

  async upload(contract: ContractModel): Promise<void> {
    const api = await this.api;
    const code = new CodePromise(api, contract.metadata, contract.wasm);

    const gasLimit = 50000n * 1000000n;
    const storageDepositLimit = null;
    const salt = new Uint8Array();
    const value = api.registry.createType('Balance', 1000000);

    const options = {
      gasLimit: gasLimit,
      storageDepositLimit: storageDepositLimit,
      salt: salt,
      value: value
    };

    const keyring = new Keyring({ type: 'sr25519', ss58Format: 42 });
    const alice = keyring.addFromUri('//Alice', { name: 'Alice' });

    let address;
    let message = "";

    const tx = code.tx['new'](options, ...contract.params[Symbol.iterator]());
    tx.signAndSend(
      alice, (result: any) => {
        message = 'Transaction status: ' + result.status.type;
        this.uploadEventMessages.next({ message: message, isFinalized: false, hasError: false });

        if (result.status.isInBlock) {
          message = 'Included at block hash\r\n' + result.status.asInBlock.toHex() + "\r\n\nFinalizing...";
          this.uploadEventMessages.next({ message: message, isFinalized: false, hasError: false });
        }

        if (result.status.isFinalized) {
          message = 'Finalized block hash ' + result.status.asFinalized.toHex();
          this.uploadEventMessages.next({ message: message, isFinalized: true, hasError: false });
          // address = result.contract.address.toString();
          console.log(result);
        }
      }
    );
  }
}
