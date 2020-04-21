import {
  Keyring,
  HDWallet,
  Events,
  ActionCancelled,
} from "@shapeshiftoss/hdwallet-core";

import { PioneerHDWallet } from "./pioneer";

type PioneerWallet = any;

const INACTIVITY_LOGOUT_TIME = 10 * 60 * 1000;

export class PioneerAdapter {
  keyring: Keyring;
  pioneer: any;
  pioneerAppId: string;

  /// wallet id to remove from the keyring when the active wallet changes
  currentDeviceId: string;

  private constructor(
    keyring: Keyring,
    args: { pioneer?: PioneerWallet; pioneerAppId?: string }
  ) {
    this.pioneer = {};
    this.pioneerAppId = "Pioneer 001";
    this.keyring = keyring;
  }

  public static useKeyring(
    keyring: Keyring,
    args: { pioneer?: PioneerWallet; pioneerAppId?: string }
  ) {
    return new PioneerAdapter(keyring, args);
  }

  public async initialize(): Promise<number> {
    return Object.keys(this.keyring.wallets).length;
  }

  public async pairDevice(): Promise<HDWallet> {
    try {
      const wallet = await this.pairPioneerDevice();
      // this.pioneer.onActiveWalletChanged( async wallAddr => {
      //   // check if currentDeviceId has changed
      //   const walletAddress = 'pioneer:' + wallAddr
      //   if(!this.currentDeviceId || (walletAddress.toLowerCase() !== this.currentDeviceId.toLowerCase())) {
      //     this.keyring.emit(["Pioneer", this.currentDeviceId, Events.DISCONNECT], this.currentDeviceId)
      //     this.keyring.remove(this.currentDeviceId)
      //     this.pairPioneerDevice()
      //   }
      // })
      // this.pioneer.onLogout( () => {
      //     this.keyring.emit(["Pioneer", this.currentDeviceId, Events.DISCONNECT], this.currentDeviceId)
      //     this.keyring.remove(this.currentDeviceId)
      // })
      return wallet;
    } catch (e) {
      if (e.message && e.message.includes("User denied login.")) {
        throw new ActionCancelled();
      } else {
        throw e;
      }
    }
  }

  private async pairPioneerDevice(): Promise<HDWallet> {
    this.pioneer = {};
    const wallet = new PioneerHDWallet(this.pioneer);
    await wallet.initialize();
    const deviceId = await wallet.getDeviceID();
    this.keyring.add(wallet, deviceId);
    this.currentDeviceId = deviceId;
    this.keyring.emit(["Pioneer", deviceId, Events.CONNECT], deviceId);

    const watchForInactivity = () => {
      let time;
      const resetTimer = () => {
        clearTimeout(time);
        time = setTimeout(() => {
          window.onload = null;
          document.onmousemove = null;
          document.onkeypress = null;
          clearTimeout(time);
          this.pioneer.logout();
        }, INACTIVITY_LOGOUT_TIME);
      };
      window.onload = resetTimer;
      document.onmousemove = resetTimer;
      document.onkeypress = resetTimer;
      resetTimer();
    };

    watchForInactivity();
    return wallet;
  }
}
