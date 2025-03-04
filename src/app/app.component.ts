import { Component, OnInit } from '@angular/core';
import { CategoryService } from './services/category.service';
import { ReceiptService } from './services/receipt.service';
import { ClientService } from './services/client.service';
import { Client } from './models/client';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  isReady: boolean = false;
  firstStart: boolean = false;
  client: any;
  constructor(private _categoryService: CategoryService,
      private _receiptService: ReceiptService,
      private _clientService: ClientService,
  ){}
  ngOnInit(): void {
    if(!this._receiptService.getAllReceipts()) {
      const categories = this._categoryService.getAllCategories();
      this._categoryService.setCategories(categories)
    }
    console.log(this._clientService.getClient());
    this.client = this._clientService.getClient()
    setInterval(()=>{
      if(!this.client){
        this.firstStart = true;
        console.log("first start");
        this.isReady=true;
      }else{
        this.isReady= true;
        this.firstStart = false
      }
      // this.isReady= true;
    }, 2000)
  }
  handleChange(e: boolean){
   if (!e) {
    this.client.checkSign = e;
   }
   
  }
  handleClientChange(e: boolean) {
    if (!e) {
      this.firstStart = e
      this.client = this._clientService.getClient()

     }     
  }
}
