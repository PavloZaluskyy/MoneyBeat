import { Injectable } from '@angular/core';
import { Good } from '../models/good';
import { LocalStorageService } from './local-storage.service';
import { Goods, Receipt } from '../models/receipt';

@Injectable({
  providedIn: 'root'
})
export class GoodsService {
  receipts: Good[] = [];
  constructor(private _localStorage: LocalStorageService) { }

  getAllGoods(){
    const res = this._localStorage.getItem("money-beat:goods");
    if(res) {
      return JSON.parse(res)
    }
    return [];

  }
  setGood(goods: Good[]): boolean {
    if(goods.length){
       this._localStorage.setItem("money-beat:goods", goods);
       return true
    }
    return false
  }

  convertReceiptToGoods(data: Receipt): {name: string, category: string}[] {
      return data.goods.map((good: Goods) => {
        return {name: good.name, category: good.category}
      })
  }

  uniqueGoods(arr:{name: string, category: string}[]): {name: string, category: string}[] | []  {
    if(arr.length){
      let output = arr.filter(
        (obj, index, arr) =>
        {
        return arr.findIndex(o =>
            {
            return JSON.stringify(o.name.toLowerCase()) === JSON.stringify(obj.name.toLowerCase())
            }) === index
        } 
      );
      return output;
    }
    return [];
  }

  firstSetLocalGoods(data: Receipt[]){
    const resGood = this.firstStartConvertGood(data);
    if(resGood.length) {
      const good: Good[] = [];
      resGood.forEach((item: {name: string, category: string}, index: number) => {
        good.push({id: index+1, name: item.name, category: item.category})
      })

      this.setGood(good)
      console.log(good);
      
    }
  }

  firstStartConvertGood(data: Receipt[]): {name: string, category: string}[] | []{
    // if(!this.getAllGoods().length){
      if(data.length){
        const goodsList = data.map(receipt => {
          return this.convertReceiptToGoods(receipt)
        })
        console.log(goodsList.flat());
        console.log(this.uniqueGoods(goodsList.flat()));
        return this.uniqueGoods(goodsList.flat())
        // goodsList.forEach((val, index) => [].concat(...goodsList[index]))
        // [].concat.apply([], goodsList)
      }
    // }
    return []
  }
}
