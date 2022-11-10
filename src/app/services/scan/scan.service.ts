import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { formatBalance } from '@polkadot/util';
import { ContractPromise } from '@polkadot/api-contract';

@Injectable({
  providedIn: 'root'
})
export class ScanService {

  constructor(
    private appSettings: AppSettings
  ) { }

  wsProvider = new WsProvider(this.appSettings.wsProviderEndpoint);
  api = ApiPromise.create({ provider: this.wsProvider });
  metadata: any = require("./../../../assets/contracts/phpu_abi.json");
  contractAddress: string = this.appSettings.phpuContractAddress;

  async generateKeypair(address: string): Promise<string> {
    const keyring = new Keyring({ type: 'sr25519', ss58Format: 0 });
    const hexPair = keyring.addFromAddress(address);

    return hexPair.address;
  }

  async getChainDexBalance(keypair: string): Promise<string> {
    const api = await this.api;
    const { nonce, data: balance } = await api.query.system.account(keypair);
    const chainDecimals = api.registry.chainDecimals[0];
    formatBalance.setDefaults({ decimals: chainDecimals, unit: 'UNIT' });
    formatBalance.getDefaults();

    const free = formatBalance(balance.free, { forceUnit: "UNIT", withUnit: false });

    return free.split(',').join('');
  }

  async getPhpuContractPsp22BalanceOf(owner: string): Promise<number> {
    const keyring = new Keyring({ type: 'sr25519', ss58Format: 0 });
    const aliceHex = keyring.addFromUri('//Alice', { name: 'Alice' });
    const api = await this.api;
    const contract = new ContractPromise(api, this.metadata, this.contractAddress);
    const options = { storageDepositLimit: null, gasLimit: -1 };
    const decimals = parseFloat(String((await contract.query['decimal'](aliceHex.address, options)).output?.toHuman()));
    const balanceOf = (await contract.query['psp22::balanceOf'](aliceHex.address, options, owner)).output;

    if (balanceOf != null) {
      return parseFloat(String(balanceOf?.toHuman()).split(',').join('')) / (10 ** decimals);
    }

    return 0;
  }
}