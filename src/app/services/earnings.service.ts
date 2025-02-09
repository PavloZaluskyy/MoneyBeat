import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { Earning } from '../models/earning';

@Injectable({
  providedIn: 'root'
})
export class EarningsService {

  constructor(private _localStorage: LocalStorageService) { }

  getAllEarnings(){
    const res = this._localStorage.getItem("money-beat:earnings");
    if(res) {
      return JSON.parse(res)
    }
    return [];
  }

  setEarning(earning: Earning[]): boolean {
      if(earning.length){
         this._localStorage.setItem("money-beat:earnings", earning);
         return true
      }
      return false
    }
}
