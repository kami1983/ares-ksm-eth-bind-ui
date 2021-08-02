<template>
  <div class="hello">
    <h1 @click="getAddressClick">{{address_state}}</h1>
    <div>KSM Address</div>
    <el-select v-model="ksm_address" placeholder="请选择 KSM Address" size="medium" >
      <el-option
          v-for="item in address_options"
          :key="item.value"
          :label="'( ' + item.label + ' ) ' + item.value "
          :value="item.value">
      </el-option>
    </el-select>
    <div>ETH Address</div>
    <el-input v-model="eth_address" placeholder="请输入 ETH 地址"></el-input>
    <el-button type="success" round @click="pushBindRelation" >Submit</el-button>
    <hr/>
    <div>Msg</div>
    <el-input v-model="raw_message" placeholder="Raw message"></el-input>
    <div>Signature info</div>
    <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        placeholder="请输入内容"
        v-model="signatured_str">
    </el-input>
    <div>Public key</div>
    <el-input v-model="public_key" placeholder="公钥地址"></el-input>
    <el-button type="success" round @click="validSignature" >Valid</el-button>

  </div>
</template>

<script>

// import { Button, Select } from 'element-ui';
// import {  web3FromSource} from '@polkadot/extension-dapp'
//
// import keyring from '@polkadot/ui-keyring';
// import { cryptoWaitReady, decodeAddress , signatureVerify, mnemonicGenerate} from '@polkadot/util-crypto';
// import { u8aToHex,stringToU8a} from '@polkadot/util';
// import { mnemonicGenerate } from '@polkadot/util-crypto';
import { getWebAccount, extractAccount , makeSignature, signatureVaild } from '../lib/web3info'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      address_options: [], // label, value
      web_address : [],
      ksm_address : '',
      eth_address : '',
      signatured_str : '',
      raw_message: '',
      public_key : '', // 公钥 input 输入的用来检测信息有效性。
      address_state : 'Click get address'
    }
  },
  mounted() {
    this.getAddressClick();
  },
  methods: {
    // 提取地址对应的用户名
    extractInfo(address) {
      for(let _index in this.address_options ) {
        let cell = this.address_options[_index]
        if( cell.value == address ) {
          return cell.label
        }
      }
    },
    async getAddressClick() {
      await this.refershAddress();
      this.refreshUserState();
    },
    async refershAddress() {
      if( this.address_options.length > 0 ) {
        return "";
      }

      // 获取浏览器插件中的用户
      const accounts = await getWebAccount()
      this.web_address = accounts
      // 打印一下看看
      console.log(this.web_address);
      // 将数据输入到下拉框
      for (let _index in this.web_address) {
        let account = this.web_address[_index]
        this.address_options.push({"value": account.address, "label": account.meta.name});
      }
    },
    refreshUserState() {
      if( this.address_options.length > 0 ) {
        this.address_state = "Select address";
      }
    },
    async pushBindRelation() {
      console.log(`KSM: ${this.ksm_address}`)
      console.log(`ETH: ${this.eth_address}`)

      // 对 ETH 地址进行加密
      if( '' != this.eth_address && '' != this.ksm_address ) {
        this.public_key = this.ksm_address
        this.raw_message = this.eth_address;
        let select_account = extractAccount(this.ksm_address, this.web_address)
        let signature = await makeSignature(select_account, this.eth_address)
        console.log(signature)
        this.signatured_str = signature
      }
      console.log("+==========")
    },
    // 验证签名
    async validSignature() {
      let vaild_result = await signatureVaild(this.raw_message, this.signatured_str, this.public_key)
      alert("验证结果" + vaild_result)
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
.el-select {
  width: 600px;
  padding-bottom: 20px;
}
.el-select li {
  display: block;
}

.el-input {
  width: 600px;
  padding-bottom: 20px;
}

.el-textarea {
  width: 600px;
  padding-bottom: 20px;
}

.el-button {
  display: block;
  margin: auto;
  padding-bottom: 20px;
}
</style>
