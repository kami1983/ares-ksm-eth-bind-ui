import {web3Accounts, web3Enable, web3FromSource} from "@polkadot/extension-dapp";
import {stringToHex, u8aToHex} from "@polkadot/util";
// import {stringToHex, stringToU8a, u8aToHex} from "@polkadot/util";
import {cryptoWaitReady, decodeAddress, signatureVerify} from "@polkadot/util-crypto";
// import {cryptoWaitReady, decodeAddress, mnemonicGenerate, signatureVerify} from "@polkadot/util-crypto";
// import keyring from "@polkadot/ui-keyring";
// import {stringToHex} from "@polkadot/util";

// 获取波卡插件上的用户
export async function getWebAccount () {
    // 判断插件是否启用
    const _ext = await web3Enable("Ares");
    if (_ext.length > 0) {
        const accounts = await web3Accounts({ss58Format:2});
        return accounts
    }
}

// 提取某一个用户
export function extractAccount(address, account_list) {
    for ( let index in account_list ) {
        if (account_list[index].address == address ) {
            return account_list[index]
        }
    }
}

// 用某个账户签名
export async function makeSignature(account, message) {
    console.log(account)
    const injector = await web3FromSource(account.meta.source);
    console.log(injector);

    // this injector object has a signer and a signRaw method
    // to be able to sign raw bytes
    const signRaw = injector?.signer?.signRaw;
    console.log(signRaw)
    if (signRaw) {
        // after making sure that signRaw is defined
        // we can use it to sign our message
        const {signature} = await signRaw({
            address: account.address,
            data: stringToHex(message),
            type: 'bytes'
        });
        return signature
    }
    console.log("signRaw bad.")
    return ""
}

// 签名验证
export function signatureVaild(signedMessage, signature, publicKey) {
    // 签名
    return cryptoWaitReady().then( async () => {
        let verify_result = signatureVerify(signedMessage, signature, publicKey).isValid;
        console.log(verify_result)
        return verify_result
    });
}

// 测试非插件签名
export function testSignature() {
    // 签名
    cryptoWaitReady().then( async () => {
        // load all available addresses and accounts
        // keyring.loadAll({ ss58Format: 2, type: 'sr25519' });
        // console.log("cryptoWaitReady .. ")
        // const account_list = keyring.getAccounts();
        // console.log(`getAccounts on keyring:: --`)
        // console.log(account_list);
        // account_list.map()
        // 添加了还想没什么作用
        // const ksm_name = this.extractInfo(this.ksm_address)
        // const json = keyring.saveAddress(this.ksm_address, { name: ksm_name });
        // console.log(`saveAddress:: --`)
        // console.log(json)

        // 测试加密解密
        let signedMessage = 'This is a text message';
        let signature = '0x2aeaa98e26062cf65161c68c5cb7aa31ca050cb5bdd07abc80a475d2a2eebc7b7a9c9546fbdff971b29419ddd9982bf4148c81a49df550154e1674a6b58bac84';
        let test_address = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';

        const publicKey = decodeAddress(test_address);
        const hexPublicKey = u8aToHex(publicKey);
        console.log("TEST==========")
        console.log(hexPublicKey)
        let signature_status = signatureVerify(signedMessage, signature, hexPublicKey).isValid;
        console.log("签名验证状态：" +  signature_status)


        // // 测试加解密2
        // // generate a random mnemonic, 12 words in length
        // const mnemonic = mnemonicGenerate(12);
        // // add the account, encrypt the stored JSON with an account-specific password
        // const { pair, json2 } = keyring.addUri(mnemonic, 'myStr0ngP@ssworD', { name: 'mnemonic acc' })
        // console.log(pair)
        // console.log(json2)
        //
        // let message = stringToU8a('abc');
        // let pair_sign = pair.sign(message);
        //
        // console.log("==============")
        // console.log(pair_sign)
        //
        // // let is_true = pair.verify(message, pair_sign);
        // let is_true = signatureVerify(message, pair_sign, pair.address).isValid;
        // console.log(is_true)
        // console.log("==============")
    });
}
