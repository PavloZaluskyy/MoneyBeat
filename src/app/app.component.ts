import { Component, OnInit } from '@angular/core';
import { CategoryService } from './services/category.service';
import { ReceiptService } from './services/receipt.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(private _categoryService: CategoryService,
      private _receiptService: ReceiptService
  ){}
  ngOnInit(): void {
    if(!this._receiptService.getAllReceipts()) {
      const categories = this._categoryService.getAllCategories();
      this._categoryService.setCategories(categories)
    }
  }
}
