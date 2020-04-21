import {
  HDWallet,
  ETHWallet,
  supportsETH,
} from "@shapeshiftoss/hdwallet-core";

// @ts-ignore
// import {
//   PioneerAdapter,
//   PioneerHDWallet,
//   isPioneer,
//   info,
//   create,
// } from "@shapeshiftoss/hdwallet-Pioneer";

export function name(): string {
  return "Pioneer";
}

const mockPioneer = {
  loadDevice: () => Promise.resolve(),
  importWallet: () => Promise.resolve(),
  provider: {},
};


// export async function createWallet(): Promise<HDWallet> {
//   //const wallet = create(mockPioneer);
//
//   if (!wallet) throw new Error("No Pioneer wallet found");
//
//   // end mock
//
//   return wallet;
// }

// export function createInfo(): HDWalletInfo {
//   return info();
// }

export function selfTest(get: () => HDWallet): void {
  //let wallet: PioneerHDWallet & ETHWallet & HDWallet;

  // beforeAll(() => {
  //   let w = get();
  //   if (isPioneer(w) && supportsETH(w)) wallet = w;
  //   else fail("Wallet is not Pioneer");
  // });

  // it("supports Ethereum mainnet", async () => {
  //   if (!wallet) return;
  //   expect(await wallet.ethSupportsNetwork(1)).toEqual(true);
  // });

  //ATOM

  //BNB

  //XRP

}
