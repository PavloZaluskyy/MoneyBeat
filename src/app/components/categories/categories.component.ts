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
import { ReceiptService } from '../../services/receipt.service';

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
  receiptsAll: Receipt[] = [];

  viewGoods: {
    category: string;
    data: string;
    name: string;
    price: number;
    quantity: number;
    id: number;
    storeName: string;
  }[] = [];

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

  isShowReceipts: boolean = false;
  isShowDate: boolean = false;
  isLoader: boolean = false;
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

  constructor(
    private receiptService: ReceiptService,
    private route: ActivatedRoute,
    private local: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.currentDateFrom = this.firstDateOfMonth();
    this.receiptsAll = this.receiptService.getAllReceipts();
    this.allCategories = this.getAllCategories();
    if (this.allCategories?.length) {
      this.selectCategory = this.allCategories?.filter((item: string) => {
        return item === this.route.snapshot.paramMap.get('name') ? item : null;
      })[0];
    }
    this.getReceiptByDateAndCategory(this.currentDateFrom, this.currentDate);
    this.goodsDate = this.getGoodsbySelectCategory();
    this.convertDateForPie();
  }

  searchDate() {
    this.isLoader = true;
    setTimeout(() => {
      if (this.dateFrom && this.dateTo) {
        this.getReceiptByDateAndCategory(this.dateFrom, this.dateTo);
      } else {
        this.getReceiptByDateAndCategory(
          this.currentDateFrom,
          this.currentDate
        );
      }
      this.isShowDate = true;
      this.isLoader = false;
      this.goodsDate = this.getGoodsbySelectCategory();
      this.convertDateForPie();
    }, 2000);
  }

  getReceiptByDateAndCategory(startDate: any, endDate: any) {
    let arr: Receipt[] = [];
    if (startDate.year) {
      arr = this.receiptsAll.filter((group) => {
        return (
          this.formatDate(group.date) >=
            new Date(`${startDate.year}.${startDate.month}.${startDate.day}`) &&
          this.formatDate(group.date) <=
            new Date(`${endDate.year}.${endDate.month}.${endDate.day}`)
        );
      });
    } else {
      arr = this.receiptsAll.filter((group) => {
        return (
          this.formatDate(group.date) >= new Date(startDate) &&
          this.formatDate(group.date) <= new Date(endDate)
        );
      });
    }

    let arr2: any = [];
    arr.forEach((receipt) => {
      let a = receipt.goods.find((good: any) => {
        if (good.category === this.selectCategory) {
          good.storeName = receipt.nameStore;
          good.date = receipt.date;
          good.id = receipt.id;
          return good;
        }
      });
      if (a) {
        arr2.push(a);
      }
    });
    this.viewGoods = arr2;
  }

  getAllCategories(): string[] | null {
    if (this.receiptsAll.length) {
      let a = this.receiptsAll.map((receipt: Receipt) => {
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

  getGoodsbySelectCategory() {
    if (this.viewGoods.length) {
      let arr = this.viewGoods.map((item) => {
        return { name: item.name, value: item.price, quantity: item.quantity };
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

  convertDateForPie() {
    if (this.viewGoods && this.viewGoods.length) {
      this.DateGoodsGoogle = this.goodsDate.map(
        (item: {
          name: string;
          value: number;
          quanity: number;
          color: string;
        }) => {
          return [item.name, item.value];
        }
      );
      this.options.colors = this.goodsDate.map(
        (item: {
          name: string;
          value: number;
          quanity: number;
          color: string;
        }) => item.color
      );
    } else {
      this.DateGoodsGoogle = [['Пусто', 0]];
    }
  }

  firstDateOfMonth() {
    let date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getContrastYIQ(hexcolor: any) {
    var r = parseInt(hexcolor.substring(1, 3), 16);
    var g = parseInt(hexcolor.substring(3, 5), 16);
    var b = parseInt(hexcolor.substring(5, 7), 16);
    var yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? 'black' : 'white';
  }

  cutReceiptsArr(): any {
    if (this.viewGoods.length > 5 && !this.isShowReceipts) {
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
        arr.push(this.viewGoods[index]);
      }
      return arr;
    }
    this.isShowReceipts = true;
    return this.viewGoods;
  }

  togleShowAllReceipts() {
    this.isShowReceipts = !this.isShowReceipts;
  }
}
