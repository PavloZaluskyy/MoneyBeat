import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Date } from '../../models/date';
import { ReceiptService } from '../../services/receipt.service';
import { ActivatedRoute } from '@angular/router';
import { Receipt } from '../../models/receipt';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss',
})
export class StoreComponent implements OnInit {
  private modalService = inject(NgbModal);
  currentDate = new Date();
  currentDateFrom: any;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  closeResult = '';

  selectStore: string | null = null;
  allStores: string[] | null = [];
  receiptsAll: Receipt[] = [];

  viewReceipts: Receipt[] = [];

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
    this.allStores = this.getAllStorage();
    if (this.allStores?.length) {
      this.selectStore = this.allStores?.filter((item: string) => {
        return item === this.route.snapshot.paramMap.get('name') ? item : null;
      })[0];
    }
    this.getReceiptByDateAndStore(this.currentDateFrom, this.currentDate);
  }

  searchDate() {
    this.isLoader = true;
    setTimeout(() => {
      if (this.dateFrom && this.dateTo) {
        this.getReceiptByDateAndStore(this.dateFrom, this.dateTo);
      } else {
        this.getReceiptByDateAndStore(this.currentDateFrom, this.currentDate);
      }
      this.isShowDate = true;
      this.isLoader = false;
    }, 2000);
  }

  cutReceiptsArr(): any {
    if (this.viewReceipts.length > 5 && !this.isShowReceipts) {
      let arr: Receipt[] = [];
      this.isShowReceipts = false;
      for (let index = 0; index < 5; index++) {
        arr.push(this.viewReceipts[index]);
      }
      return arr;
    }
    this.isShowReceipts = true;
    return this.viewReceipts;
  }

  togleShowAllReceipts() {
    this.isShowReceipts = !this.isShowReceipts;
  }

  getReceiptByDateAndStore(startDate: any, endDate: any) {
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
      let a;
      if (receipt.nameStore === this.selectStore) {
        a = receipt;
      }
      if (a) {
        arr2.push(a);
      }
    });
    this.viewReceipts = arr2;
  }

  getAllStorage(): string[] | null {
    if (this.receiptsAll.length) {
      let arr = this.receiptsAll.map((receipt: Receipt) => {
        return receipt.nameStore;
      });

      return [...new Set(arr)];
    }
    return null;
  }
}
