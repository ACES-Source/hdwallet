
//
global.window = {};
global.document = {};

let TEST_SEED  = "alcohol woman abuse must during monitor noble actual mixed trade anger aisle"

let hdwallet = require("../../hdwallet-core/dist")
let pioneer = require("../dist/index")

console.log(hdwallet)
console.log(pioneer)
console.log(pioneer.isPioneer())

let keyring = new hdwallet.Keyring()

let run_test = async function(){
    try{
        const pioneerAdapter = pioneer.PioneerAdapter.useKeyring(keyring, {})
        //pair
        const wallet = await pioneerAdapter.pairDevice()
        //load
        await wallet.loadDevice({ mnemonic: TEST_SEED })

        //verify addys
        const result = await wallet.getPublicKeys([
            {
                addressNList: [0x80000000 + 44, 0x80000000 + 0, 0x80000000 + 0],
                curve: 'secp256k1',
                showDisplay: true, // Not supported by TrezorConnect or Ledger, but KeepKey should do it
                coin: 'Bitcoin'
            },
            {
                addressNList: [0x80000000 + 44, 0x80000000 + 0, 0x80000000 + 1],
                curve: 'secp256k1',
                showDisplay: true, // Not supported by TrezorConnect or Ledger, but KeepKey should do it
                coin: 'Bitcoin'
            },
            {
                addressNList: [0x80000000 + 49, 0x80000000 + 0, 0x80000000 + 0],
                curve: 'secp256k1',
                showDisplay: true, // Not supported by TrezorConnect or Ledger, but KeepKey should do it
                coin: 'Bitcoin',
                scriptType: 'p2sh'
            },
            {
                addressNList: [0x80000000 + 44, 0x80000000 + 2, 0x80000000 + 0],
                curve: 'secp256k1',
                showDisplay: true, // Not supported by TrezorConnect or Ledger, but KeepKey should do it
                coin: 'Litecoin'
            }
            // {
            //   addressNList: hardenedPath,
            //   curve: 'secp256k1',
            //   showDisplay: true, // Not supported by TrezorConnect or Ledger, but KeepKey should do it
            //   coin: 'Ethereum'
            // }
        ])
        console.log('get Xpubs: ', result)

    }catch(e){
        console.error(e)
    }
}
run_test()
