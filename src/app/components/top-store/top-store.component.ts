import {
  Component,
  ElementRef,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Date } from '../../models/date';
import { ReceiptService } from '../../services/receipt.service';
import { Receipt } from '../../models/receipt';
import { ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-top-store',
  templateUrl: './top-store.component.html',
  styleUrl: './top-store.component.scss',
})
export class TopStoreComponent implements OnInit {
  @ViewChild('closebutton') closebutton: ElementRef | undefined;
  isTogleTooltips = true;
  private modalService = inject(NgbModal);
  currentDate = new Date();
  currentDateFrom: any;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  closeResult = '';
  receiptAll: Receipt[] = [];
  viewReceipt: Receipt[] = [];

  type: ChartType.PieChart = ChartType.PieChart;
  DateCategoryGoogle: any = [];
  // colorPieArr: string[] = [];

  options = {
    // colors: this.colorPieArr,
    legend: {
      position: 'top',
      maxLines: 100,
      alignment: 'start',
    },
  };
  width = 350;
  height = 400;

  searchDate(ev: any) {
    if (this.dateFrom && this.dateTo) {
      this.getReceiptByDateAndCategory(this.dateFrom, this.dateTo);
    } else {
      this.getReceiptByDateAndCategory(this.currentDateFrom, this.currentDate);
    }
    this.convertDateForPieQuanity();
    this.viewReceipt = this.sortDate();
    ev.close('ss');
  }

  getReceiptByDateAndCategory(startDate: any, endDate: any) {
    let arr: Receipt[] = [];
    if (startDate.year) {
      arr = this.receiptAll.filter((group) => {
        return (
          this.formatDate(group.date) >=
            new Date(`${startDate.year}.${startDate.month}.${startDate.day}`) &&
          this.formatDate(group.date) <=
            new Date(`${endDate.year}.${endDate.month}.${endDate.day}`)
        );
      });
    } else {
      arr = this.receiptAll.filter((group) => {
        return (
          this.formatDate(group.date) >= new Date(startDate) &&
          this.formatDate(group.date) <= new Date(endDate)
        );
      });
    }
    this.viewReceipt = this.getDateForStore(arr);
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

  sortDate(): Receipt[] {
    return this.viewReceipt.sort((a, b) =>
      a.totalAmaund > b.totalAmaund ? -1 : 0
    );
  }
  firstDateOfMonth() {
    let date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  convertDateForPieQuanity() {
    if (this.viewReceipt && this.viewReceipt.length) {
      this.DateCategoryGoogle = this.viewReceipt.map((item: Receipt) => {
        return [item.nameStore, item.totalAmaund];
      });
    }
  }

  constructor(private _receiptService: ReceiptService) {}
  ngOnInit(): void {
    this.currentDateFrom = this.firstDateOfMonth();
    this.receiptAll = this._receiptService.getAllReceipts();
    this.viewReceipt = this.getDateForStore(this.receiptAll);
    this.convertDateForPieQuanity();
    this.viewReceipt = this.sortDate();
  }
  getDateForStore(arr: Receipt[]): Receipt[] {
    const outputData = arr.reduce((acc: any, curr) => {
      const existingEntry = acc.find(
        (item: any) => item.nameStore === curr.nameStore
      );
      if (existingEntry) {
        existingEntry.totalAmaund += curr.totalAmaund;
      } else {
        acc.push({ ...curr });
      }
      return acc;
    }, []);
    return outputData;
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
}
