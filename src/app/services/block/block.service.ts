import { Injectable } from '@angular/core';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { AppSettings } from 'src/app/app-settings';

@Injectable({
  providedIn: 'root'
})
export class BlockService {

  constructor(
    private appSettings: AppSettings
  ) { }

  wsProvider = new WsProvider(this.appSettings.wsProviderEndpoint);
  api = ApiPromise.create({ provider: this.wsProvider });
  keypair = this.appSettings.keypair;

  async blocks(): Promise<any> {
    let blockArray: any[] = [];
    const api = await this.api;

    await api.rpc.chain.subscribeNewHeads(async (lastHeader) => {
      let extrinsics = (await api.rpc.chain.getBlock(`${lastHeader.hash}`)).block.extrinsics;
      let signature = `${extrinsics[0].signer}`;

      const timestamp = await api.query.timestamp.now();

      const signedBlock = await api.rpc.chain.getBlock(`${lastHeader.hash}`);
      const apiAt = await api.at(signedBlock.block.header.hash);
      const allRecords = await apiAt.query.system.events();

      let extrinsic = JSON.parse(`${allRecords}`);
      let weight = extrinsic[0].event.data[0].weight;
      let _extrinsics: any[] = [];
      let events: any[] = [];

      signedBlock.block.extrinsics.forEach(async ({ method: { method, section } }, index) => {
        let data: any;
        const _events = allRecords
          .filter(({ phase }) =>
            phase.isApplyExtrinsic &&
            phase.asApplyExtrinsic.eq(index)
          ).map(({ event }) => data = {
            name: `${event.section}.${event.method}`,
            data: JSON.parse(`${event.data}`)
          });
        events.push(_events);
      });

      let index = 0;
      for (var i = 0; i < events.length; i++) {
        for (var e = 0; e < events[i].length; e++) {
          if (events[i][e].name == 'system.ExtrinsicSuccess') weight = events[i][e].data[0].weight;
          _extrinsics.push({
            id: ++index,
            extrinsic: events[i][e].name,
            data: events[i][e].data
          });
        }
      }

      _extrinsics.sort((a, b) => b.id - a.id);
      blockArray.push({
        timestamp: timestamp,
        block: `${lastHeader.number}`,
        hash: `${lastHeader.hash}`,
        extrinsics: _extrinsics,
        weight: weight,
        signature: signature,
      });
      blockArray.sort((a, b) => b.block - a.block);
    });

    return blockArray;
  }
}
