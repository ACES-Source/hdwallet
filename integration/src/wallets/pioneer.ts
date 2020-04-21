import {
  HDWallet,
  ETHWallet,
  supportsETH,
  HDWalletInfo,
} from "@shapeshiftoss/hdwallet-core";
import {
  PioneerAdapter,
  PioneerHDWallet,
  isPioneer,
  info,
  create,
} from "@shapeshiftoss/hdwallet-Pioneer";

export function name(): string {
  return "Pioneer";
}

const mockPioneer = {
  loadDevice: () => Promise.resolve(),
  importWallet: () => Promise.resolve(),
  provider: {},
};

const mockSignEthTxResponse = {
  tx: {
    r: "0x63db3dd3bf3e1fe7dde1969c0fc8850e34116d0b501c0483a0e08c0f77b8ce0a",
    s: "0x28297d012cccf389f6332415e96ee3fc0bbf8474d05f646e029cd281a031464b",
    v: 38,
  },
  raw:
    "0xf86b018501dcd650008256229412ec06288edd7ae2cc41a843fe089237fc7354f0872c68af0bb140008026a063db3dd3bf3e1fe7dde1969c0fc8850e34116d0b501c0483a0e08c0f77b8ce0aa028297d012cccf389f6332415e96ee3fc0bbf8474d05f646e029cd281a031464b",
};

const mockSignERC20TxResponse = {
  tx: {
    r: "0x1238fd332545415f09a01470350a5a20abc784dbf875cf58f7460560e66c597f",
    s: "0x10efa4dd6fdb381c317db8f815252c2ac0d2a883bd364901dee3dec5b7d3660a",
    v: 37,
  },
  raw:
    "0xf8a20114149441e5560054824ea6b0732e656e3ad64e20e94e4580b844a9059cbb0000000000000000000000001d8ce9022f6284c3a5c317f8f34620107214e54500000000000000000000000000000000000000000000000000000002540be40025a01238fd332545415f09a01470350a5a20abc784dbf875cf58f7460560e66c597fa010efa4dd6fdb381c317db8f815252c2ac0d2a883bd364901dee3dec5b7d3660a",
};

export async function createWallet(): Promise<HDWallet> {
  const wallet = create(mockPioneer);

  if (!wallet) throw new Error("No Pioneer wallet found");

  // end mock

  return wallet;
}

export function createInfo(): HDWalletInfo {
  return info();
}

export function selfTest(get: () => HDWallet): void {
  let wallet: PioneerHDWallet & ETHWallet & HDWallet;

  beforeAll(() => {
    let w = get();
    if (isPioneer(w) && supportsETH(w)) wallet = w;
    else fail("Wallet is not Pioneer");
  });

  it("supports Ethereum mainnet", async () => {
    if (!wallet) return;
    expect(await wallet.ethSupportsNetwork(1)).toEqual(true);
  });

  it("prepends Pioneer: to the eth address to create the deviceId", async () => {
    if (!wallet) return;
    expect(await wallet.getDeviceID()).toEqual(
      "Pioneer:0x3f2329C9ADFbcCd9A84f52c906E936A42dA18CB8"
    );
  });

  it("does not support more than one account path", async () => {
    if (!wallet) return;
    const paths = await wallet.ethGetAccountPaths({
      coin: "Ethereum",
      accountIdx: 0,
    });
    expect(paths.length).toEqual(1);
    const nextPath = await wallet.ethNextAccountPath(paths[0]);
    expect(nextPath).toBeUndefined();
  });
}
