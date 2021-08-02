<template>
  <div id="app">
    <div class="content-frame">
      <div class="head-panel">
        <div class="ares-icons">Ars Protocol</div>
        <div class="ares-nav">
          <connect-wallet @selected-account="selectedAccount" class="connect-wallet" />
          <el-button href="#" type="success"> English </el-button>
        </div>
      </div>
      <div class="body-panel">
        <BindEth />
      </div>
      <div class="foot-panel">
        <a href="#">About Us</a>
      </div>
    </div>
  </div>
</template>

<script>
import BindEth from './components/bind-eth.vue'
import ConnectWallet from './components/connect-wallet.vue'
export default {
  name: 'App',
  components: {
    BindEth,
    ConnectWallet,
  },
  methods : {
    // Set selected account to global variable.
    selectedAccount(account) {
      this.$store.commit('set_address', account)
      console.log(this.$store.state.oper_address)
    }
  }
}
</script>

<style>

a {
  color: #42b983;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  /*border: red 1px solid;*/
  width: 800px;
  margin: auto;
}

.head-panel {
  display: flex;
  flex-direction: row;
  justify-content:space-between;
}

.ares-nav {
  display: flex;
  flex-direction: row;
}

.connect-wallet {
  padding-right: 10px;
}
</style>
