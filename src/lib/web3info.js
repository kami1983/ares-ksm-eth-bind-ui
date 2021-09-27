import {web3Accounts, web3Enable, web3FromSource} from "@polkadot/extension-dapp";
import {stringToHex, u8aToHex} from "@polkadot/util";
import {cryptoWaitReady, decodeAddress, signatureVerify} from "@polkadot/util-crypto";

/**
 * Get users on Polkadot web plugin, it may be more than one.
 * @return [] is account object list on Polkadot web plugin.
 * */
export async function getWebAccount (origin_name, ss58_format) {
    // Determine whether the plug-in is enabled
    const _ext = await web3Enable(origin_name);
    if (_ext.length > 0) {
        const accounts = await web3Accounts({ss58Format: ss58_format});
        return accounts
    }
    return []
}

/**
 * Query related user object by KSM address
 * @param address is string type KSM address, loop it and find out account relation object.
 * @param account_list is account object list of Polkadot on web plugin
 * @return object is find out result.
 * */
export function extractAccount(address, account_list) {
    for ( let index in account_list ) {
        if (account_list[index].address == address ) {
            return account_list[index]
        }
    }
    return undefined
}

/**
 * Sign with an account.
 * @param account is account object on Polkadot not simple string address.
 * @param message is an string for encrypted.
 * @return string is an encrypted signature.
 * */
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

/**
 * Verify signature, this function for test.
 * */
export function signatureVaild(signedMessage, signature, publicKey) {
    // 签名
    return cryptoWaitReady().then( async () => {
        let verify_result = signatureVerify(signedMessage, signature, publicKey).isValid;
        return verify_result
    });
}

// Other test
export function testSignature() {
    // Signature
    cryptoWaitReady().then( async () => {
        // Test singn
        let signedMessage = 'This is a text message';
        let signature = '0x2aeaa98e26062cf65161c68c5cb7aa31ca050cb5bdd07abc80a475d2a2eebc7b7a9c9546fbdff971b29419ddd9982bf4148c81a49df550154e1674a6b58bac84';
        let test_address = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';

        const publicKey = decodeAddress(test_address);
        const hexPublicKey = u8aToHex(publicKey);
        console.log("TEST==========")
        console.log(hexPublicKey)
        let signature_status = signatureVerify(signedMessage, signature, hexPublicKey).isValid;
        console.log("Sign status: " +  signature_status)

    });
}
