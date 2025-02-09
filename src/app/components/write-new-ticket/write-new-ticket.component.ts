import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import {
  ModalDismissReasons,
  NgbDateStruct,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  OperatorFunction,
} from 'rxjs';
import { ReceiptService } from '../../services/receipt.service';
import { Goods, Receipt } from '../../models/receipt';
import { Router } from '@angular/router';
import { GoodsService } from '../../services/goods.service';
import { Good } from '../../models/good';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-write-new-ticket',
  templateUrl: './write-new-ticket.component.html',
  styleUrl: './write-new-ticket.component.scss',
})
export class WriteNewTicketComponent implements OnInit {
  private modalService = inject(NgbModal);

  allReceipt: Receipt[] = [];
  searchAllStore: { name: string; adress: string }[] = [];
  searchAllGood: Good[] = [];
  searchAllCategory: Category[] = [];
  currentDate = new Date();
  selectDate: Date | undefined;
  closeResult = '';
  goods: Goods[] = [{ name: '', quantity: '', price: '', category: '' }];
  modelDate: NgbDateStruct | undefined;
  exemple_goods: string[] = ['Молоко', 'Масло', 'Сметана', 'Кефір'];
  date: { year: number; month: number } | undefined;
  model: any;
  messageValid: string = '';
  isValidForm: { nameStore: boolean; adressStore: boolean } = {
    nameStore: true,
    adressStore: true,
  };
  isValidGood: {name: boolean; quantity: boolean; category: boolean; price: boolean}[] = [{
    name: true,
    quantity: true,
    category: true,
    price: true
  }]
  modelStoreName: string = '';
  modelAdressStore: string = '';
  modelCategoryGood: string = '';

  constructor(
    private _receiptService: ReceiptService,
    private _goodsService: GoodsService,
    private _categoryService: CategoryService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.allReceipt = this._receiptService.getAllReceipts();
    this.searchAllStore = this._receiptService.getAllStore(this.allReceipt);
    this.searchAllGood = this._goodsService.getAllGoods();
    this.searchAllCategory = this._categoryService.getAllCategories();
  }
  open(content: TemplateRef<any>) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        },
      );
  }
  addNewGood() {
    this.goods.push({ name: '', quantity: '', price: '', category: '' });
    this.isValidGood.push({ name: true,
      quantity: true,
      category: true,
      price: true})
  }
  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  searchStore: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>,
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 2
          ? []
          : this.searchAllStore
              .map((item) => item.name)
              .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10),
      ),
    );

  searchGood: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>,
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 2
          ? []
          : this.searchAllGood
              .map((item) => item.name)
              .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10),
      ),
    );

  validationForm(): boolean {
    this.isValidForm.nameStore = true;
    this.isValidForm.adressStore = true;
    this.isValidGood = this.isValidGood.map(g => {
      g.name = true;
      g.category = true;
      g.quantity = true;
      g.price = true;
      return g;
    })
    if (!this.modelStoreName.trim()) {
      this.isValidForm.nameStore = false;
      this.messageValid = 'Введіть назву магазину!';
      return false;
    }
    if (!this.modelAdressStore.trim()) {
      this.isValidForm.adressStore = false;
      this.messageValid = 'Введіть адресу магазину!';
      return false;
    }
    for(let i in this.goods){
      if (!this.goods[i].name.trim()) {
        this.isValidGood[i].name = false;
        return false
      }
      if (!this.goods[i].quantity) {
        this.isValidGood[i].quantity = false;
        return false
      }
      if (!this.goods[i].category.trim()) {
        this.isValidGood[i].category = false;
        return false
      }
      if (!this.goods[i].price) {
        this.isValidGood[i].price = false;
        return false
      }
    }
    return true;
  }

  searchCategory: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>,
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 2
          ? []
          : this.searchAllCategory
              .map((item) => item.name)
              .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10),
      ),
    );

  search: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>,
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 2
          ? []
          : this.exemple_goods
              .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10),
      ),
    );

  getTotalAmound(): number {
    return this.goods.length
      ? this.goods.reduce((acc, curr) => +acc + +curr.price, 0)
      : 0;
  }

  parseAddres() {
    const findElement =
      this.searchAllStore.find((item) =>
        item.name === this.modelStoreName ? item.adress : '',
      )?.adress || undefined;
    if (findElement) {
      this.modelAdressStore = findElement;
    }
  }
  parseCategoryGood(name: string, index: number) {
    const findElement =
      this.searchAllGood.find((item) =>
        item.name === name ? item.category : '',
      )?.category || undefined;
    if (findElement) {
      this.goods[index].category = findElement;
    }
  }
  refresh(index: number) {
    this.goods[index].name = '';
    this.goods[index].quantity = '';
    this.goods[index].category = '';
    this.goods[index].price = '';
  }

  delete(index: number) {
    if (this.goods.length > 1) {
      this.goods.splice(index, 1);
    }
  }

  sentReceipt() {
    if (this.validationForm()) {
      const newReceipt: Receipt = {
        id: this.allReceipt.length + 1,
        nameStore: this.modelStoreName,
        adressStore: this.modelAdressStore,
        date: this.modelDate?.day
          ? this.modelDate?.day +
            '.' +
            this.modelDate?.month +
            '.' +
            this.modelDate?.year
          : this.currentDate.getDate() + '.' + (this.currentDate.getMonth() + 1) + '.' + this.currentDate.getFullYear(),
        goods: this.goods,
        totalAmaund: this.getTotalAmound(),
      };
      this.allReceipt.push(newReceipt);
      this._receiptService.setReceipt(this.allReceipt);
      this._goodsService.firstSetLocalGoods(this.allReceipt);
      this.router.navigateByUrl('');
    }
  }

  deleteId(){
   const a = this.allReceipt.filter(v => v.id !=9 && v.id !=10)
   console.log(a);
   this._receiptService.setReceipt(a)
  }
}
