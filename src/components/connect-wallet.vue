<template>
  <div class="main-frame">

    <el-dropdown trigger="click">
      <span class="el-button el-button--success el-dropdown-link"  @click="getAddressClick">{{button_text}}</span>
      <el-dropdown-menu slot="dropdown">
        <lin-dropdown-item v-for="(item,i) in this.account_address_list" v-bind:key="i" @item-click="selectAccount(item)">({{item.meta.name}}){{item.address}}</lin-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
// import const config | item-click
import {BACKEND_CONTRIBUTED_URL, KUSAMA_SS58_FORMAT, ORIGIN_NAME} from '../config/const'
// import web3 support lib
import {getWebAccount} from '../lib/web3info'
import LinDropdownItem from './dropdown-item.vue'
import axios from "axios";

const CONST_BUTTON_TEXT_IS_CONNECT_WALLET = 'Connect Wallet'
const CONST_BUTTON_TEXT_IS_SELECT_ACCOUNT = 'Select Account'

export default {
  name: 'connect-wallet',
  props: {
  },
  components: {
    LinDropdownItem
  },
  data() {
    return {
      // The text of the button may be `Connect Wallet`, `Select Account`, `「Account-Sign」`
      button_text : CONST_BUTTON_TEXT_IS_CONNECT_WALLET,
      // Save all of account address from web3 plugin.
      account_address_list : [],
      // Address information selected by the user from the `account_address_list` list
      selected_account : '',
    }
  },
  mounted() {
    // Clicked address click button by default
    this.getAddressClick();
  },
  methods: {
    // Get account show name lable from address list.
    extractInfo(address) {
      for (let _index in this.account_address_list) {
        let cell = this.account_address_list[_index]
        if (cell.value == address) {
          return cell.label
        }
      }
    },
    // Obtain account address list by web3 plugin
    async getAddressClick() {
      // On mounted of life cycle, refershAddress will be called once,
      // and here is called manually.
      await this.refershAddress();
      // Refresh text of button.
      this.refreshButtonText();
    },
    // Call the web3 plugin for obtain account list then fill to address_options variable.
    async refershAddress() {
      // If address list exists process will be skip.
      if (this.account_address_list.length > 0) {
        return "";
      }
      // Obtain accounts objects.
      const accounts = await getWebAccount(ORIGIN_NAME, KUSAMA_SS58_FORMAT)
      this.account_address_list = undefined == accounts ? [] : accounts
      // Print for testing.
      console.log('account_address_list::', this.account_address_list);
    },
    // Refresh text of button
    refreshButtonText() {
      // If user has selected then skip this process.
      if ("" != this.selected_account) {
        return null
      }
      // Determine whether the address list is filled
      if ( this.account_address_list.length > 0 ) {
        this.button_text = CONST_BUTTON_TEXT_IS_SELECT_ACCOUNT;
      } else {
        this.button_text = CONST_BUTTON_TEXT_IS_CONNECT_WALLET;
      }
    },
    // Triggered by user selection.
    async selectAccount (account) {
      // Set account on component variable.
      this.selected_account = account
      // test address : DwNtx1QwfKHLjtrZJNYhesqcJQBukefNCTb8jTHNRerTmKY
      const contributed = await this.getContributed(account.address)
      console.log('contributed', contributed)
      // Update text of connection button.
      this.button_text = `(${account.meta.name})${account.address},${contributed / 100000000000000000}`
      this.$emit('selected-account',account, contributed)
    },
    getContributed(address) {
      // /get-extrinsic/DwNtx1QwfKHLjtrZJNYhesqcJQBukefNCTb8jTHNRerTmKY
      return new Promise(function(resolve, reject) {
        axios({
          method: "get",
          url: BACKEND_CONTRIBUTED_URL+ `/${address}`,
        }).then((res) => {
          console.log(res.data)
          if( res.data.length <= 0 ) {
            resolve(0)
          }else{
            resolve(res.data[0].contributed)
          }
        }).catch((err) => {
          reject(err)
        })
      })
    }
  }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.el-select {
  width: 600px;
  padding-bottom: 20px;
}

.el-select li {
  display: block;
}

.el-button {
  display: block;
  margin: auto;
}
</style>
