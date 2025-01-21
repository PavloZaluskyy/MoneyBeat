import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Goods, Receipt } from '../../models/receipt';
import { ReceiptService } from '../../services/receipt.service';
import { ActivatedRoute } from '@angular/router';
import { Date } from '../../models/date';
import { ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-good-statistic',
  templateUrl: './good-statistic.component.html',
  styleUrl: './good-statistic.component.scss',
})
export class GoodStatisticComponent implements OnInit {
  active = 1;
  private modalService = inject(NgbModal);
  currentDate = new Date();
  currentDateFrom: any;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  closeResult = '';

  selectGood: string | null = null;
  allGoods: string[] | null = [];
  receiptsAll: Receipt[] = [];

  type: ChartType.LineChart = ChartType.LineChart;
  columnNames: any = ['data', 'Goods'];

  chartData = {
    type: 'LineChart',
    data: [],
    columnNames: this.columnNames,
    options: {
      hAxis: {
        title: 'Date',
      },
      vAxis: {
        title: 'Price',
      },
    },
    width: 350,
    height: 400,
  };
  chartDataQuanity = {
    type: 'LineChart',
    data: [],
    columnNames: this.columnNames,
    options: {
      hAxis: {
        title: 'Date',
      },
      vAxis: {
        title: 'Quanity',
      },
    },
    width: 350,
    height: 400,
  };
  viewGoods: any;
  goodData: any;
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

  firstDateOfMonth() {
    let date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }
  constructor(
    private receiptService: ReceiptService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.currentDateFrom = this.firstDateOfMonth();
    this.receiptsAll = this.receiptService.getAllReceipts();
    this.allGoods = this.getAllGoods();
    if (this.allGoods?.length) {
      this.selectGood = this.allGoods?.filter((item: string) => {
        return item === this.route.snapshot.paramMap.get('name') ? item : null;
      })[0];

      this.getReceiptByDateAndCategory(this.currentDateFrom, this.currentDate);
    }
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

  getAllGoods(): string[] | null {
    if (this.receiptsAll.length) {
      let a = this.receiptsAll.map((receipt: Receipt) => {
        return receipt.goods.map((good: Goods) => {
          return { name: good.name, value: good.price };
        });
      });
      let arr2 = [...new Set(a.flat())];
      let arr3 = [...new Set(arr2.map((item) => item.name))];
      return arr3;
    }
    return null;
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
      this.goodData = this.getGoodsbySelectGood();
      this.convertDateForPie();
      this.convertDateForPieQuanity();
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
    let a: any = [];
    arr.forEach((receipt) => {
      receipt.goods.map((good: any) => {
        if (good.name === this.selectGood) {
          good.storeName = receipt.nameStore;
          good.addressStore = receipt.adressStore;
          good.totalAmound = receipt.totalAmaund;
          good.date = receipt.date;
          good.id = receipt.id;
          a.push(good);
        }
      });
    });
    this.viewGoods = a;
  }

  getGoodsbySelectGood() {
    if (this.viewGoods.length) {
      let arr = this.viewGoods.map((item: any) => {
        return {
          name: item.name,
          value: item.price,
          quantity: item.quantity,
          date: item.date,
        };
      });
      let arr2 = [...new Set(arr.flat())];
      let arr3: any = [];
      arr2.forEach((item: any) => {
        if (item) {
          arr3.push(item);
        }
      });
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
        };
      }
      result[item.name].quanity++;
      result[item.name].value += parseInt(item.value);
    });
    return Object.values(result);
  }

  convertDateForPie() {
    if (this.viewGoods && this.viewGoods.length) {
      this.chartData.data = this.goodData.map(
        (item: {
          name: string;
          value: number;
          quanity: number;
          color: string;
          date: string;
        }) => {
          return [item.date, item.value];
        }
      );
    }
  }
  convertDateForPieQuanity() {
    if (this.viewGoods && this.viewGoods.length) {
      this.chartDataQuanity.data = this.goodData.map(
        (item: {
          name: string;
          value: number;
          quantity: number;
          color: string;
          date: string;
        }) => {
          return [item.date, item.quantity];
        }
      );
    }
  }
}
