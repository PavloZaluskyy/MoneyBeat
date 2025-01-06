import {
  Component,
  ElementRef,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Date } from '../../models/date';

import { Observable } from 'rxjs/internal/Observable';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from 'rxjs/operators';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OperatorFunction } from 'rxjs';
import { LocalStorageService } from '../../services/local-storage.service';
import { Goods, Receipt } from '../../models/receipt';
import { ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit {
  private modalService = inject(NgbModal);
  currentDate = new Date();
  currentDateFrom: any;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  closeResult = '';

  selectCategory: string | null = null;
  allCategories: string[] | null = [];
  receipts: Receipt[] = [];

  type: ChartType.PieChart = ChartType.PieChart;
  DateGoodsGoogle: any = [];
  colorPieArr: string[] = [];

  options = {
    colors: this.colorPieArr,
    legend: {
      position: 'top',
      maxLines: 100,
      alignment: 'start',
    },
  };
  width = 350;
  height = 400;

  goodsDate: any = [];
  goodByCategory: Goods[] = [];
  isShowReceipts: boolean = false;
  viewReceipt: {
    category: string;
    data: string;
    name: string;
    price: number;
    quantity: number;
    storeName: string;
  }[] = [];
  isShowDate: boolean = false;
  isLoader: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private _localStorage: LocalStorageService
  ) {}

  ngOnInit() {
    this.getReceiptFromLocalStore();
    this.allCategories = this.getAllCategories();
    if (this.allCategories?.length) {
      this.selectCategory = this.allCategories?.filter((item: string) => {
        return item === this.route.snapshot.paramMap.get('name') ? item : null;
      })[0];
    }
    this.currentDateFrom = this.firstDateOfMonth();
    this.goodsDate = this.getGoodsbySelectCategory();
    this.convertDateForPie();
  }

  toggleShowDate() {
    this.isShowDate != this.isShowDate;
  }
  searchDate() {
    this.isLoader = true;
    setTimeout(() => {
      if (this.dateFrom && this.dateTo) {
        if (!this.receipts.length) {
          this.getReceiptFromLocalStore();
        }
        this.isShowDate = true;
        this.isLoader = false;
        let arr = this.receipts.filter((group) => {
          return (
            this.formatDate(group.date) >=
              new Date(
                `${this.dateFrom?.year}.${this.dateFrom?.month}.${this.dateFrom?.day}`
              ) &&
            this.formatDate(group.date) <=
              new Date(
                `${this.dateTo?.year}.${this.dateTo?.month}.${this.dateTo?.day}`
              )
          );
        });
        this.receipts = arr;
        this.goodsDate = this.getGoodsbySelectCategory();
        this.convertDateForPie();
        this.formatReceipts();
      } else {
        if (!this.receipts.length) {
          this.getReceiptFromLocalStore();
        }

        let arr = this.receipts.filter((group) => {
          return (
            this.formatDate(group.date) >=
              new Date(
                `${this.currentDateFrom?.year}.${this.currentDateFrom?.month}.${this.currentDateFrom?.day}`
              ) &&
            this.formatDate(group.date) <=
              new Date(
                `${this.currentDate?.getFullYear()}.${this.currentDate?.getMonth()}.${
                  this.currentDate?.getDay
                }`
              )
          );
        });
        this.receipts = arr;
        this.goodsDate = this.getGoodsbySelectCategory();
        this.convertDateForPie();
        this.formatReceipts();
      }
    }, 3000);
  }
  formatDate(input: any) {
    if (input.length >= 20) {
      return new Date(input);
    } else {
      var datePart = input.match(/\d+/g),
        year = datePart[2].substring(2), // get only two digits
        month = datePart[1],
        day = datePart[0];

      return new Date(month + '/' + day + '/' + year);
    }
  }

  getContrastYIQ(hexcolor: any) {
    var r = parseInt(hexcolor.substring(1, 3), 16);
    var g = parseInt(hexcolor.substring(3, 5), 16);
    var b = parseInt(hexcolor.substring(5, 7), 16);
    var yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? 'black' : 'white';
  }

  convertDateForPie() {
    if (this.goodsDate && this.goodsDate.length) {
      this.DateGoodsGoogle = this.goodsDate.map(
        (item: { name: string; value: number; color: string }) => {
          return [item.name, item.value];
        }
      );
      this.options.colors = this.goodsDate.map((item: any) => item.color);
    } else {
      this.DateGoodsGoogle = [['Пусто', 0]];
      this.options.colors = ['#FFF'];
    }
  }

  getAllCategories(): string[] | null {
    if (this.receipts.length) {
      let a = this.receipts.map((receipt: Receipt) => {
        return receipt.goods.map((good: Goods) => {
          return { name: good.category, value: good.price };
        });
      });
      let arr2 = [...new Set(a.flat())];
      let arr3 = [...new Set(arr2.map((item) => item.name))];
      return arr3;
    }
    return null;
  }

  processArray(arr: any) {
    const result: any = {};
    arr.forEach((item: any) => {
      if (!result[item.name]) {
        result[item.name] = {
          name: item.name,
          quanity: 0,
          value: 0,
          color: this.getRandomColor(),
        };
      }
      result[item.name].quanity++;
      result[item.name].value += parseInt(item.value);
    });
    return Object.values(result);
  }
  getGoodsbySelectCategory() {
    if (this.receipts.length) {
      let arr = this.receipts.map((receipt: Receipt) => {
        return receipt.goods.map((good: Goods) => {
          if (good.category === this.selectCategory) {
            return { name: good.name, value: good.price };
          }
          return null;
        });
      });
      let arr2 = [...new Set(arr.flat())];
      let arr3: any = [];
      arr2.forEach((item: any) => {
        if (item) {
          arr3.push(item);
        }
      });
      return this.processArray(arr3);
    }
    return null;
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  firstDateOfMonth() {
    let date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  getReceiptFromLocalStore() {
    const res = this._localStorage.getItem('money-beat:receipts');
    if (res) {
      this.receipts = JSON.parse(res);
    }
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
        }
      );
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
  reloadCalendar() {
    this.dateFrom = undefined;
    this.dateTo = undefined;
  }
  getSelectDate(date: any) {
    this.dateFrom = date[0];
    this.dateTo = date[1];
  }

  formatReceipts() {
    if (this.goodsDate.length) {
      if (this.receipts.length) {
        let arr: any = [];
        this.goodsDate.map(
          (item: {
            name: string;
            quanity: number;
            value: number;
            color: string;
          }) => {
            return this.receipts.forEach((receipt: Receipt) => {
              let a: any;
              a = receipt.goods.find((good: Goods) => item.name === good.name);
              a.storeName = receipt.nameStore;
              a.data = receipt.date;
              arr.push(a);
            });
          }
        );

        this.viewReceipt = arr;
      }
    }
  }

  cutReceiptsArr(): any {
    if (this.viewReceipt.length > 5 && !this.isShowReceipts) {
      let arr: {
        category: string;
        data: string;
        name: string;
        price: number;
        quantity: number;
        storeName: string;
      }[] = [];
      this.isShowReceipts = false;
      for (let index = 0; index < 5; index++) {
        arr.push(this.viewReceipt[index]);
      }
      return arr;
    }
    this.isShowReceipts = true;
    return this.viewReceipt;
  }

  togleShowAllReceipts() {
    this.isShowReceipts = !this.isShowReceipts;
  }
}
