<template>
  <div>

    <div>
      <h1> CROWDLOAN DROP ACTIVITY </h1>
    </div>
    <div class="crowdloan-info">
      <div> Join <a href="#">Crowdloan</a></div>
      <div> ICON</div>
      <div> Submit ethereum account</div>
    </div>
    <div class="eth-bind-area">
      <div class="eth-input">
        <div class="input-tip-label">Please input ethereum address</div>
        <div class="input-btn">
          <el-input v-model="eth_address" placeholder="ETH Address"></el-input>
          <el-button type="success" round @click="pushBindRelation">Submit</el-button>
        </div>
      </div>
      <div>
        <span style="color:RED;">{{tip_msg}}</span>
      </div>
    </div>
  </div>
</template>

<script>
// import const config
// import {KUSAMA_SS58_FORMAT, ORIGIN_NAME} from '../config/const'
// import web3 support lib
import {makeSignature} from '../lib/web3info'
import {BACKEND_VALID_URL} from '../config/const'
import axios from "axios"

export default {
  name: 'home-page',
  props: {
    msg: String
  },
  data() {
    return {
      eth_address: '',
      tip_msg: '',
    }
  },
  mounted() {
    // this.getAddressClick();
  },
  methods: {
    // 提取地址对应的用户名
    // extractInfo(address) {
    //   for(let _index in this.address_options ) {
    //     let cell = this.address_options[_index]
    //     if( cell.value == address ) {
    //       return cell.label
    //     }
    //   }
    // },
    // async getAddressClick() {
    //   await this.refershAddress();
    //   this.refreshUserState();
    // },
    // async refershAddress() {
    //   if( this.address_options.length > 0 ) {
    //     return "";
    //   }
    //
    //   // 获取浏览器插件中的用户
    //   const accounts = await getWebAccount(ORIGIN_NAME, KUSAMA_SS58_FORMAT)
    //   this.web_address = accounts
    //   // 打印一下看看
    //   console.log(this.web_address);
    //   // 将数据输入到下拉框
    //   for (let _index in this.web_address) {
    //     let account = this.web_address[_index]
    //     this.address_options.push({"value": account.address, "label": account.meta.name});
    //   }
    // },
    // refreshUserState() {
    //   if( this.address_options.length > 0 ) {
    //     this.address_state = "Select address";
    //   }
    // },
    async pushBindRelation() {
      let v = this
      const select_account = this.$store.state.oper_address
      if (undefined == select_account) {
        console.log("Need to select a walletf first.")
        v.tip_msg = 'Need to select a wallet first.'
        return null
      }

      // console.log(`KSM: ${this.ksm_address}`)
      // console.log(`ETH: ${this.eth_address}`)

      // 对 ETH 地址进行加密
      if ('' == this.eth_address) {
        v.tip_msg = 'Input your eth wallet address.'
      }else{
        const raw_message = this.eth_address;
        let signature = await makeSignature(select_account, raw_message).catch(function (e) {
          console.log(e)
          v.tip_msg = 'User cancelled.'
          console.log("RUN 1 ", this.tip_msg)
        })
        // Signature is fail break function.
        console.log("RUN 2 ", signature)
        if(undefined == signature) return null;
        // Submit data to verify node.
        v.signatured_str = signature
        const data = {
          ksm_address: select_account.address,
          eth_address: raw_message,
          sign_str: signature
        }
        console.log(data)
        axios({
          method: "post",
          url: BACKEND_VALID_URL,
          data: data,
        }).then((res) => {
          console.log(res.data)
          if(true === res.data) {
            v.tip_msg = 'Submitted successfully and verified.'
          }else{
            v.tip_msg = 'Verification failed, signature error.'
          }
        })
      }
      console.log("+==========")
    },
    // // 验证签名
    // async validSignature() {
    //   let vaild_result = await signatureVaild(this.raw_message, this.signatured_str, this.public_key)
    //   alert("验证结果" + vaild_result)
    // }
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

.el-input {
  width: 600px;
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
.crowdloan-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top:20px;
  padding-bottom: 20px;
}

.crowdloan-info div {
  margin: auto;
}

.eth-bind-area {
  /*border: #42b983 solid 1px;*/
  padding-bottom: 20px;
}

.eth-bind-area .eth-input .input-btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.eth-bind-area .eth-input {
  width: 800px;
  margin: auto;
  /*border: yellow solid 1px;*/
}

.eth-bind-area .eth-input .input-tip-label {
  text-align: left;
}

</style>
