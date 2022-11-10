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

    let actualFee = '0';

    await api.rpc.chain.subscribeNewHeads(async (lastHeader) => {
      let network = localStorage.getItem('network') || '';

      const apiAt = await api.at(lastHeader.hash);
      const events = await apiAt.query.system.events();

      let existingTransactions: AccountTransactionModel[] = [];
      let newTransactions: AccountTransactionModel[] = [];

      if (events.length > 0) {
        for (let i = 0; i < events.length; i++) {
          let section: any = events[i].event.section;
          let method: any = events[i].event.method;
          let data: any = events[i].event.data.toHuman();

          if (section == "transactionPayment" && method == 'TransactionFeePaid') {
            actualFee = data['actualFee'];
          }
        }

        for (let i = 0; i < events.length; i++) {
          let section: any = events[i].event.section;
          let method: any = events[i].event.method;
          let data: any = events[i].event.data.toHuman();

          if (section == "balances" && method == 'BalanceSet') { }

          if (section == "balances" && method == 'Deposit') {
            let transaction: AccountTransactionModel = {
              hash: lastHeader.hash.toHuman(),
              method: method,
              blocks: lastHeader.number.toHuman()?.toString() || '',
              age: '0',
              from: data['who'],
              to: '',
              value: data['amount'],
              fee: actualFee,
              network: network
            };

            transactions.push(transaction);
            newTransactions.push(transaction);
          }

          if (section == "balances" && method == 'DustLost') { }

          if (section == "balances" && method == 'Endowed') {
            let transaction: AccountTransactionModel = {
              hash: lastHeader.hash.toHuman(),
              method: method,
              blocks: lastHeader.number.toHuman()?.toString() || '',
              age: '0',
              from: '',
              to: data['account'],
              value: data['freeBalance'],
              fee: actualFee,
              network: network
            };

            transactions.push(transaction);
            newTransactions.push(transaction);
          }

          if (section == "balances" && method == 'Reserved') {
            let transaction: AccountTransactionModel = {
              hash: lastHeader.hash.toHuman(),
              method: method,
              blocks: lastHeader.number.toHuman()?.toString() || '',
              age: '0',
              from: data['who'],
              to: '',
              value: data['amount'],
              fee: actualFee,
              network: network
            };

            transactions.push(transaction);
            newTransactions.push(transaction);
          }

          if (section == "balances" && method == 'ReserveRepatriated') { }

          if (section == "balances" && method == 'Slashed') { }

          if (section == "balances" && method == 'Transfer') {
            let transaction: AccountTransactionModel = {
              hash: lastHeader.hash.toHuman(),
              method: method,
              blocks: lastHeader.number.toHuman()?.toString() || '',
              age: '0',
              from: data['from'],
              to: data['to'],
              value: data['amount'],
              fee: actualFee,
              network: network
            };

            transactions.push(transaction);
            newTransactions.push(transaction);
          }

          if (section == "balances" && method == 'Unreserved') { }

          if (section == "balances" && method == 'Withdraw') {
            let transaction: AccountTransactionModel = {
              hash: lastHeader.hash.toHuman(),
              method: method,
              blocks: lastHeader.number.toHuman()?.toString() || '',
              age: '0',
              from: data['who'],
              to: '',
              value: data['amount'],
              fee: actualFee,
              network: network
            };

            transactions.push(transaction);
            newTransactions.push(transaction);
          }

          if (section == "system" && method == 'NewAccount') {
            let transaction: AccountTransactionModel = {
              hash: lastHeader.hash.toHuman(),
              method: method,
              blocks: lastHeader.number.toHuman()?.toString() || '',
              age: '0',
              from: '',
              to: data['account'],
              value: '0',
              fee: actualFee,
              network: network
            };

            transactions.push(transaction);
            newTransactions.push(transaction);
          }

          if (section == "system" && method == 'Called') { }

          if (section == "system" && method == 'CodeRemoved') { }

          if (section == "system" && method == 'CodeStored') {
            let transaction: AccountTransactionModel = {
              hash: lastHeader.hash.toHuman(),
              method: method,
              blocks: lastHeader.number.toHuman()?.toString() || '',
              age: '0',
              from: '',
              to: '',
              value: '0',
              fee: actualFee,
              network: network
            };

            transactions.push(transaction);
            newTransactions.push(transaction);
          }

          if (section == "system" && method == 'ContractCodeUpdated') { }

          if (section == "system" && method == 'ContractEmitted') { }

          if (section == "system" && method == 'DelegateCalled') { }

          if (section == "system" && method == 'Instantiated') {
            let transaction: AccountTransactionModel = {
              hash: lastHeader.hash.toHuman(),
              method: method,
              blocks: lastHeader.number.toHuman()?.toString() || '',
              age: '0',
              from: data['deployer'],
              to: '',
              value: '0',
              fee: actualFee,
              network: network
            };

            transactions.push(transaction);
            newTransactions.push(transaction);
          }

          if (section == "system" && method == 'Terminated') { }
        }
      }

      if (existingTransactions.length == 0) {
        let existingBlocks = JSON.parse(localStorage.getItem('blocks') || '[]');
        if (existingBlocks.length > 0) {
          for (let i = 0; i < existingBlocks.length; i++) {
            existingTransactions.push({
              hash: existingBlocks[i].hash,
              method: existingBlocks[i].method,
              blocks: existingBlocks[i].blocks,
              age: existingBlocks[i].age,
              from: existingBlocks[i].from,
              to: existingBlocks[i].to,
              value: existingBlocks[i].value,
              fee: existingBlocks[i].fee,
              network: existingBlocks[i].network
            });
          }
        }
      }

      if (newTransactions.length > 0) {
        for (let i = 0; i < newTransactions.length; i++) {
          existingTransactions.push({
            hash: newTransactions[i].hash,
            method: newTransactions[i].method,
            blocks: newTransactions[i].blocks,
            age: newTransactions[i].age,
            from: newTransactions[i].from,
            to: newTransactions[i].to,
            value: newTransactions[i].value,
            fee: newTransactions[i].fee,
            network: newTransactions[i].network
          });
        }

        localStorage.setItem('blocks', JSON.stringify(existingTransactions));
        newTransactions = [];
      }
    });

    let returnTransactions: AccountTransactionModel[] = [];
    let existingLocalTransactions = JSON.parse(localStorage.getItem('blocks') || '[]');
    if (existingLocalTransactions.length > 0) {
      const chainDecimals = api.registry.chainDecimals[0];
      formatBalance.setDefaults({ decimals: chainDecimals, unit: 'UNIT' });
      formatBalance.getDefaults();
      
      for (let i = 0; i < existingLocalTransactions.length; i++) {
        const value = parseFloat(String(existingLocalTransactions[i].value).replace(/,/g,'')) / 1000000000000;
        const fee = parseFloat(String(existingLocalTransactions[i].fee).replace(/,/g,'')) / 1000000000000;

        returnTransactions.push({
          hash: existingLocalTransactions[i].hash,
          method: existingLocalTransactions[i].method,
          blocks: existingLocalTransactions[i].blocks,
          age: existingLocalTransactions[i].age,
          from: existingLocalTransactions[i].from,
          to: existingLocalTransactions[i].to,
          value: String(value),
          fee: String(fee),
          network: existingLocalTransactions[i].network
        });
      }
    }

    let currentNetwork: string = localStorage.getItem('network') || '';
    return returnTransactions.filter(d => d.network == currentNetwork);
  }
}
