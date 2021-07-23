<template>
  <div class="hello">
    <h1 @click="refershClick">I'm Ares</h1>
  </div>
</template>

<script>

// import {cryptoWaitReady} from "@polkadot/util-crypto";
// import keyring from "@polkadot/ui-keyring";
import { web3Enable, web3Accounts, web3FromSource} from '@polkadot/extension-dapp'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods: {
    async refershClick() {
      console.log("Refresh");
      // 判断插件是否启用
      const _ext = await web3Enable("Polkadot Relay Chain");
      if (_ext.length > 0) {
        const accounts = await web3Accounts();
        console.log(accounts);
        // We arbitraily select the first account returned from the above snippet
        // `account` is of type InjectedAccountWithMeta
        const account = accounts[0];
        // to be able to retrieve the signer interface from this account
        // we can use web3FromSource which will return an InjectedExtension type
        const injector = await web3FromSource(account.meta.source);
        console.log(injector);
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
