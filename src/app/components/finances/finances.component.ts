import {
  Component,
  ElementRef,
  inject,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  ModalDismissReasons,
  NgbActiveModal,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { Date } from '../../models/date';
import { ChartType } from 'angular-google-charts';
import { LocalStorageService } from '../../services/local-storage.service';
import { Goods, Receipt } from '../../models/receipt';
// import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
// import * as pluginDataLabels from 'chartjs-plugin-datalabels';
// import { SingleDataSet, Label } from 'ng2-charts';

@Component({
  selector: 'app-finances',
  templateUrl: './finances.component.html',
  styleUrl: './finances.component.scss',
})
export class FinancesComponent implements OnInit {
  @ViewChild('closebutton') closebutton: ElementRef | undefined;
  isTogleTooltips = true;
  private modalService = inject(NgbModal);
  currentDate = new Date();
  currentDateFrom: any;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  closeResult = '';
  isShowReceipts: boolean = false;
  /*Google pie*/
  type: ChartType.PieChart = ChartType.PieChart;
  DateCategoryGoogle: any = [];
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

  categiriesDate: { name: string; value: number; color: string }[] | null = [];
  receipts: Receipt[] = [];
  constructor(private _localStorage: LocalStorageService) {}
  ngOnInit() {
    this.currentDateFrom = this.firstDateOfMonth();
    this.getReceiptFromLocalStore();
    this.categiriesDate = this.getCategoriesAndTZotalAmound();
    this.convertDateForPie();
    // this.cutReceiptsArr()
  }
  firstDateOfMonth() {
    let date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }
  cutReceiptsArr(): Receipt[] {
    if (this.receipts.length > 5 && !this.isShowReceipts) {
      let arr: Receipt[] = [];
      this.isShowReceipts = false;
      for (let index = 0; index < 5; index++) {
        arr.push(this.receipts[index]);
      }
      return arr;
    }
    this.isShowReceipts = true;
    return this.receipts;
  }
  togleShowAllReceipts() {
    this.isShowReceipts = !this.isShowReceipts;
  }
  totalSpending(): number {
    let sum: number = 0;
    if (this.categiriesDate) {
      this.categiriesDate.forEach((item) => {
        sum += item.value;
      });
    }
    return sum;
  }
  formatDate(input: any) {
    var datePart = input.match(/\d+/g),
      year = datePart[2].substring(2), // get only two digits
      month = datePart[1],
      day = datePart[0];

    return new Date(month + '/' + day + '/' + year);
  }

  searchDate(ev: any) {
    if (this.dateFrom && this.dateTo) {
		if(!this.receipts.length){
			this.getReceiptFromLocalStore()
		}
      let arr = this.receipts.filter((group) => {
        return (
          this.formatDate(group.date) >
            new Date(
              `${this.dateFrom?.year}.${this.dateFrom?.month}.${this.dateFrom?.day}`
            ) &&
          this.formatDate(group.date) <
            new Date(
              `${this.dateTo?.year}.${this.dateTo?.month}.${this.dateTo?.day}`
            )
        );
      });
      this.receipts = arr;
      this.categiriesDate = this.getCategoriesAndTZotalAmound();
      this.convertDateForPie();
    }
    ev.close('ss');
  }


  
  getContrastYIQ(hexcolor: any) {
    var r = parseInt(hexcolor.substring(1, 3), 16);
    var g = parseInt(hexcolor.substring(3, 5), 16);
    var b = parseInt(hexcolor.substring(5, 7), 16);
    var yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? 'black' : 'white';
  }

  convertDateForPie() {
    if (this.categiriesDate && this.categiriesDate.length) {
      this.DateCategoryGoogle = this.categiriesDate.map(
        (item: { name: string; value: number; color: string }) => {
          return [item.name, item.value];
        }
      );
      this.options.colors = this.categiriesDate.map((item) => item.color);
    } else {
      this.DateCategoryGoogle = [['Пусто', 0]];
      this.options.colors = ['#FFF'];
    }
  }
  getReceiptFromLocalStore() {
    const res = this._localStorage.getItem('money-beat:receipts');
    if (res) {
      this.receipts = JSON.parse(res);
    }
  }

  getCategoriesAndTZotalAmound():
    | { name: string; value: number; color: string }[]
    | null {
    if (this.receipts) {
      let arr = this.receipts.map((item: Receipt) => {
        return item.goods.map((good: Goods) => {
          return { name: good.category, value: good.price };
        });
      });
      let arr2 = [...new Set(arr.flat())];
      //let arr3 = [...new Set(arr2.map(item => item.name))];

      return this.convertUniqueArrAndSumVal(arr2);
    }
    return null;
  }
  convertUniqueArrAndSumVal(
    date: { name: string; value: string }[]
  ): { name: string; value: number; color: string }[] {
    return Object.values(
      date.reduce((hash: any, item: any) => {
        if (!hash[item.name]) {
          hash[item.name] = { name: item.name, value: 0, color: '#fff' };
        }
        hash[item.name].value += +item.value;
        hash[item.name].color = this.getRandomColor();
        return hash;
      }, {})
    );
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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
    this.getReceiptFromLocalStore();
    this.categiriesDate = this.getCategoriesAndTZotalAmound();
    this.convertDateForPie();
  }

  getSelectDate(date: any) {
    this.dateFrom = date[0];
    this.dateTo = date[1];
  }
}
