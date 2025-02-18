import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Date } from '../../models/date';
import { ChartType } from 'angular-google-charts';
import { EarningsService } from '../../services/earnings.service';
import { Earning } from '../../models/earning';

@Component({
  selector: 'app-earning-st',
  templateUrl: './earning-st.component.html',
  styleUrl: './earning-st.component.scss'
})
export class EarningStComponent implements OnInit {

  private modalService = inject(NgbModal);
    currentDate = new Date();
    currentDateFrom: any;
    dateFrom: Date | undefined;
    dateTo: Date | undefined;
    closeResult = '';

    allEarning: Earning[] =[];
    viewEarning: Earning[] =[];
     type: ChartType.PieChart = ChartType.PieChart;
      DateEarningGoogle: any = [];
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

      goodsDate: any = [];


    isShowReceipts: boolean = false;
  isShowDate: boolean= false;
  isLoader: boolean = false;

  constructor(private _earningService: EarningsService) {}

  ngOnInit(): void {
    this.currentDateFrom = this.firstDateOfMonth();
    this.allEarning = this._earningService.getAllEarnings();
    console.log(this.allEarning);
    this.getReceiptByDateAndCategory(this.currentDateFrom, this.currentDate)
    this.goodsDate = this.getGoodsbySelectCategory()
    this.convertDateForPie();

  }

  searchDate(){
    this.isLoader = true;
    setTimeout(() => {
      if(this.dateFrom && this.dateTo) {      
        this.getReceiptByDateAndCategory(this.dateFrom, this.dateTo)
      } else {
        this.getReceiptByDateAndCategory(this.currentDateFrom, this.currentDate)
      }
      this.isShowDate = true;
    this.isLoader = false;
    this.goodsDate = this.getGoodsbySelectCategory()
      console.log(this.goodsDate);
      this.convertDateForPie();
 
    }, 1000)
  }

  getReceiptByDateAndCategory(startDate: any, endDate: any){
    let arr: Earning[] = [];
    if (startDate.year) {
      arr = this.allEarning.filter(group => {
        return this.formatDate(group.date) >= new Date(`${startDate.year}.${startDate.month}.${startDate.day}`)
        &&
        this.formatDate(group.date) <=
                new Date(
                  `${endDate.year}.${endDate.month}.${endDate.day}`
                )
      })
    } else {
      arr = this.allEarning.filter((group) => {
        return this.formatDate(group.date) >= new Date(startDate) 
          && 
          this.formatDate(group.date) <=
                new Date(endDate)
      })
    }
    this.viewEarning = arr
  }

  getGoodsbySelectCategory(){
    if (this.viewEarning.length) {
      let arr = this.viewEarning.map(item => {
        return { name: item.nameEarning, value: item.totalAmound };
      })
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
  cutReceiptsArr(): any {
    if (this.viewEarning.length > 5 && !this.isShowReceipts) {
      let arr: any = [];
      this.isShowReceipts = false;
      for (let index = 0; index < 5; index++) {
        arr.push(this.viewEarning[index]);
      }
      return arr;
    }
    this.isShowReceipts = true;
    return this.viewEarning;
  }

  togleShowAllReceipts() {
    this.isShowReceipts = !this.isShowReceipts;
  }

  processArray(arr: any) {
    const result: any = {};
    arr.forEach((item: any) => {
      if (!result[item.name]) {
        
        result[item.name] = {
          name: item.name,
          value: 0,
        };
      }
      result[item.name].value += parseInt(item.value);
    });
    return Object.values(result);
  }
  
  convertDateForPie() {
    if(this.viewEarning && this.viewEarning.length) {
      this.DateEarningGoogle = this.goodsDate.map((item: {name: string, value: number, color: string}) => {return [item.name, item.value];});
          } else {
            this.DateEarningGoogle = [['Пусто', 0]];
          }
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

  formatDate(input: any) {    
    if (input.length >= 20) {
      return new Date(input) ;
    } else {
      var datePart = input.match(/\d+/g),
        year = datePart[2].substring(2), // get only two digits
        month = datePart[1],
        day = datePart[0];

      return new Date(month + '/' + day + '/' + year);
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

      firstDateOfMonth() {
        let date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), 1);
      }

}
