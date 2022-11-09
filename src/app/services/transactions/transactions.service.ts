import { Injectable } from '@angular/core';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { AppSettings } from 'src/app/app-settings';
import { AccountTransactionModel } from 'src/app/models/account-transaction.model';
import { formatBalance } from '@polkadot/util';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  constructor(
    private appSettings: AppSettings
  ) { }

  wsProvider = new WsProvider(this.appSettings.wsProviderEndpoint);
  api = ApiPromise.create({ provider: this.wsProvider });

  async getTransactions(): Promise<AccountTransactionModel[]> {
    const api = await this.api;
    let transactions: AccountTransactionModel[] = [];

    await api.rpc.chain.subscribeNewHeads(async (lastHeader) => {
      const apiAt = await api.at(lastHeader.hash);
      const events = await apiAt.query.system.events();

      const chainDecimals = apiAt.registry.chainDecimals[0];
      formatBalance.setDefaults({ decimals: chainDecimals, unit: 'UMI' });
      formatBalance.getDefaults();

      if (events.length > 0) {
        for (let i = 0; i < events.length; i++) {
          let section: any = events[i].event.section;
          let method: any = events[i].event.method;
          let data: any = events[i].event.data.toHuman();

          let actualFee = '0';
          if (section == "transactionPayment" && method == 'TransactionFeePaid') {
            actualFee = data['actualFee']
          }

          if (section == "balances" && method == 'BalanceSet') { }

          if (section == "balances" && method == 'Deposit') {
            const amount = formatBalance(data['amount'], { forceUnit: "UMI", withUnit: false });

            transactions.push({
              hash: lastHeader.hash.toHuman(),
              method: method,
              blocks: lastHeader.number.toHuman()?.toString() || '',
              age: '0',
              from: data['who'],
              to: '',
              value: amount,
              fee: actualFee
            });
          }

          if (section == "balances" && method == 'DustLost') { }

          if (section == "balances" && method == 'Endowed') {
            transactions.push({
              hash: lastHeader.hash.toHuman(),
              method: method,
              blocks: lastHeader.number.toHuman()?.toString() || '',
              age: '0',
              from: '',
              to: data['account'],
              value: data['freeBalance'],
              fee: actualFee
            });
          }

          if (section == "balances" && method == 'Reserved') {
            transactions.push({
              hash: lastHeader.hash.toHuman(),
              method: method,
              blocks: lastHeader.number.toHuman()?.toString() || '',
              age: '0',
              from: data['who'],
              to: '',
              value: data['amount'],
              fee: actualFee
            });
          }

          if (section == "balances" && method == 'ReserveRepatriated') { }

          if (section == "balances" && method == 'Slashed') { }

          if (section == "balances" && method == 'Transfer') {
            transactions.push({
              hash: lastHeader.hash.toHuman(),
              method: method,
              blocks: lastHeader.number.toHuman()?.toString() || '',
              age: '0',
              from: data['from'],
              to: data['to'],
              value: data['amount'],
              fee: actualFee
            });
          }

          if (section == "balances" && method == 'Unreserved') { }

          if (section == "balances" && method == 'Withdraw') {
            transactions.push({
              hash: lastHeader.hash.toHuman(),
              method: method,
              blocks: lastHeader.number.toHuman()?.toString() || '',
              age: '0',
              from: data['who'],
              to: '',
              value: data['amount'],
              fee: actualFee
            });
          }

          if (section == "system" && method == 'NewAccount') {
            transactions.push({
              hash: lastHeader.hash.toHuman(),
              method: method,
              blocks: lastHeader.number.toHuman()?.toString() || '',
              age: '0',
              from: '',
              to: data['account'],
              value: '0',
              fee: actualFee
            });
          }

          if (section == "system" && method == 'Called') { }

          if (section == "system" && method == 'CodeRemoved') { }

          if (section == "system" && method == 'CodeStored') {
            transactions.push({
              hash: lastHeader.hash.toHuman(),
              method: method,
              blocks: lastHeader.number.toHuman()?.toString() || '',
              age: '0',
              from: '',
              to: '',
              value: '0',
              fee: actualFee
            });
          }

          if (section == "system" && method == 'ContractCodeUpdated') { }

          if (section == "system" && method == 'ContractEmitted') { }

          if (section == "system" && method == 'DelegateCalled') { }

          if (section == "system" && method == 'Instantiated') {
            transactions.push({
              hash: lastHeader.hash.toHuman(),
              method: method,
              blocks: lastHeader.number.toHuman()?.toString() || '',
              age: '0',
              from: data['deployer'],
              to: '',
              value: '0',
              fee: actualFee
            });
          }

          if (section == "system" && method == 'Terminated') { }
        }
      }
    });

    return transactions;
  }
}
