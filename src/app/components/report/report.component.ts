import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { Date } from '../../models/date';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReceiptService } from '../../services/receipt.service';
import { Goods, Receipt } from '../../models/receipt';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss',
})
export class ReportComponent implements OnInit {
  private modalService = inject(NgbModal);
  currentDate = new Date();
  currentDateFrom: any;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  closeResult = '';

  receiptsAll: Receipt[] = [];

  differenceDays: number = 0;
  totalAmound: number = 0;
  nameMonth: string = '';
  isShowReceipts: boolean = false;
  isShowDate: boolean = false;
  isLoader: boolean = false;

  showReportbyReceipt: { name: string; value: number }[] | null = [];

  constructor(private _receiptService: ReceiptService) {}

  ngOnInit(): void {
    this.currentDateFrom = this.firstDateOfMonth();
    this.receiptsAll = this._receiptService.getAllReceipts();
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
      this.getDifferenceDayBetweenTwoDates(this.dateFrom, this.dateTo);
      this.getTotalAmound();
      this.getNameMounth(this.dateTo);
      this.isShowDate = true;
      this.isLoader = false;
    }, 2000);
  }

  getDifferenceDayBetweenTwoDates(
    firstDate: any = this.currentDateFrom,
    secondDate: any = this.currentDate
  ) {
    let date1, date2;
    if (!firstDate.year || !secondDate.year) {
      date1 = new Date(firstDate);
      date2 = new Date(secondDate);
    } else {
      date1 = new Date(`${firstDate.year}-${firstDate.month}-${firstDate.day}`);
      date2 = new Date(
        `${secondDate.year}-${secondDate.month}-${secondDate.day}`
      );
    }
    const differenceInMs: number = Math.abs(date2.getTime() - date1.getTime());
    const millisecondsInDay: number = 1000 * 60 * 60 * 24;
    const differenceInDays: number = Math.floor(
      differenceInMs / millisecondsInDay
    );
    this.differenceDays = differenceInDays;
  }

  getTotalAmound() {
    let sum = 0;
    this.showReportbyReceipt?.map((i) => {
      sum += i.value;
    });
    this.totalAmound = sum;
  }
  getNameMounth(date: any = this.currentDate) {
    let date1;
    if (!date.year) {
      date1 = new Date(date);
    } else {
      date1 = new Date(`${date.year}-${date.month}-${date.day}`);
    }
    this.nameMonth = date.toLocaleString('default', { month: 'long' });
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
    this.showReportbyReceipt = this.getCategoriesAndTZotalAmound(arr);
  }

  getCategoriesAndTZotalAmound(
    receipts: Receipt[]
  ): { name: string; value: number }[] | null {
    if (receipts) {
      let arr = receipts.map((item: Receipt) => {
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
  ): { name: string; value: number }[] {
    return Object.values(
      date.reduce((hash: any, item: any) => {
        if (!hash[item.name]) {
          hash[item.name] = { name: item.name, value: 0 };
        }
        hash[item.name].value += +item.value;
        // hash[item.name].color = this.getRandomColor();
        return hash;
      }, {})
    );
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
  firstDateOfMonth() {
    let date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
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
}
