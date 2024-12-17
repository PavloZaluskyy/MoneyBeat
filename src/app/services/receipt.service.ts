import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { Receipt } from '../models/receipt';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {
  receipts: ReceiptService[] = [];

  constructor(private _localStorage: LocalStorageService) { }

  getAllReceipts(){
    const res = this._localStorage.getItem("money-beat:receipts");
    if(res) {
      return JSON.parse(res)
    }
    return [];

  }
  setReceipt(receipts: Receipt[]): boolean {
    if(receipts.length){
       this._localStorage.setItem("money-beat:receipts", receipts);
       return true
    }
    return false
  }

  getAllStore(data:Receipt[] | []): {name: string, adress: string}[] {
    if(data.length){
      let output = data.filter(
        (obj, index, arr) =>
        {
        return arr.findIndex(o =>
            {
            return JSON.stringify(o.nameStore) === JSON.stringify(obj.nameStore)
            }) === index
        } 
    ); console.log(output);
    
      return output.map(item =>{ return {name: item.nameStore, adress: item.adressStore}})
    }
    return []
  }
}
