import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js'; 
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
}) 
export class EncryptionService {
  private readonly AES_SECRET_KEY = environment.encryption_key;
  private readonly AES_ALGORITHM = 'aes-256-cbc';

  // private readonly SMILEID_APIKEY = '4fd4bd71-1395-47b1-9e84-d77b6badbaaf';
  private readonly SMILEID_APIKEY = environment.smileIdApikey;
  private readonly SMILEID_PARTNER_ID = environment.kycSmileIdPartnerId;

  public timeStamp = new Date().toISOString()

  encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.AES_SECRET_KEY).toString();
  }

  decrypt(data: string): string {
    const bytes = CryptoJS.AES.decrypt(data, this.AES_SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  generateKYCSignature() {
    const encrypted = this.createHmacString(this.SMILEID_APIKEY, this.timeStamp, this.SMILEID_PARTNER_ID);
    return encrypted;
  }

  createHmacString(privateKey, ts, partnerId) {
    let hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, privateKey);
    hmac.update(ts, 'utf8');
    hmac.update(partnerId, 'utf8');
    hmac.update("sid_request", 'utf8');
    var hash = hmac.finalize();
    let signature = CryptoJS.enc.Base64.stringify(hash);

    return signature;
  }
}