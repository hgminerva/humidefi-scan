import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { BN, formatBalance } from '@polkadot/util';

// const { ApiPromise } = require('@polkadot/api');

@Injectable({
  providedIn: 'root'
})
export class ScanService {

  wsProvider;

  constructor(
    private appSettings: AppSettings
  ) {
    let network: any = localStorage.getItem('network') == null ? '' : localStorage.getItem('network');
    if (network.toLowerCase() == 'Main') {
      this.wsProvider = new WsProvider(this.appSettings.wsProviderEndpoint);
    } else if (network.toLowerCase() == 'Test') {
      this.wsProvider = new WsProvider(this.appSettings.localWSProviderEndpoint);
    }
  }

  async getAccountDetail(account: string) {
    const api = await ApiPromise.create({ provider: this.wsProvider });
    let accountDetail = await api.query.system.account(account);
    let entries = await api.query.system.account(account);
    const multiQuery = await api.queryMulti([[api.query.system.account, account]]);

    const [entryHash, entrySize] = await Promise.all([
      api.query.system.account.hash(account),
      api.query.system.account.size(account)
    ]);

    console.log(`The current size is ${entrySize} bytes with a hash of ${entryHash}`);
    // const finalizedHeads = await api.rpc.chain.subscribeFinalizedHeads;

    console.log('entries', entries);
    console.log('query', multiQuery);
    console.log('account detail', accountDetail);

    const query = await api.query.system.account;

    // Display some info on a specific entry
    console.log(query);
    console.log(`query key: ${api.query.system.account.key(account)}`);
  }

  async getAccountBalance(account: string): Promise<string> {
    const api = await ApiPromise.create({ provider: this.wsProvider });
    let { data: { free: previousFree }, nonce: previousNonce } = await api.query.system.account(account);
    const free = formatBalance(`${previousFree}`);

    const _account = await api.query.system.account(account);

    console.log(_account);

    return `${previousFree}`;
  }

  async generateKeypair(address: string): Promise<string> {
    const keyring = new Keyring({ type: 'sr25519', ss58Format: 0 });
    const hexPair = keyring.addFromAddress(address);

    return hexPair.address;
  }

  async getBalance(keypair: string): Promise<string> {
    const api = await ApiPromise.create({ provider: this.wsProvider });

    const { nonce, data: balance } = await api.query.system.account(keypair);
    const chainDecimals = api.registry.chainDecimals[0];
    formatBalance.setDefaults({ decimals: chainDecimals, unit: 'UMI' });
    formatBalance.getDefaults();

    const free = formatBalance(chainDecimals);

    return free.split(',').join('');
  }
}
