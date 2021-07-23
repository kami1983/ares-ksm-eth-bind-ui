import Vue from 'vue'
import App from './App.vue'

import { ApiPromise, WsProvider } from '@polkadot/api';
import keyring from '@polkadot/ui-keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';


Vue.config.productionTip = false

const wsProvider = new WsProvider('ws://localhost:9944');
// const wsProvider = new WsProvider('wss://polkadot.elara.patract.io');

const _api = new ApiPromise({wsProvider}) ;
_api.on('connected', () => {
  console.log('On connected');
});
_api.on('error', () => {
  console.log('On error');
});
_api.on('ready', () => {
  console.log('On ready');
  console.log(_api.genesisHash.toHex());
  cryptoWaitReady().then(() => {
    // 如果想使用Alice 要启用 isDevelopment: false
    keyring.loadAll({ ss58Format: 42, type: 'sr25519' ,genesisHash: _api.genesisHash , isDevelopment: true});
    console.log("On cryptoWaitReady.");
    // const account_list = keyring.getAccounts();
    // console.log(account_list);
    const keyringOptions = keyring.getPairs().map(account => ({
      key: account.address,
      value: account.address,
      text: account.meta.name.toUpperCase(),
      icon: 'user'
    }));
    console.log(keyringOptions);
  });
});


new Vue({
  render: h => h(App),
}).$mount('#app')
