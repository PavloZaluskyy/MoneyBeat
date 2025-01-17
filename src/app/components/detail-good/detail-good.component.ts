import { Component, inject, OnInit, signal, TemplateRef, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReceiptService } from '../../services/receipt.service';
import { Goods, Receipt } from '../../models/receipt';
import { ModalDismissReasons, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChartType } from 'angular-google-charts';
import { Good } from '../../models/good';

@Component({
  selector: 'app-detail-good',
  templateUrl: './detail-good.component.html',
  styleUrl: './detail-good.component.scss'
})
export class DetailGoodComponent implements OnInit {
  private modalService = inject(NgbModal);
	closeResult: WritableSignal<string> = signal('');

   type: ChartType.PieChart = ChartType.PieChart;
    DateGoodsGoogle: any = [];
    colorPieArr: string[] = [];
    options = {
      legend: {
        position: 'top',
        maxLines: 100,
        alignment: 'start',
      },
    };
    width = 320;
    height = 400;
  
    goodsDate: any = [];

  receiptsAll: Receipt[] | null = [];
  selectReceipt: Receipt | any;
  constructor(private route: ActivatedRoute,
              private receiptService: ReceiptService
  ){}


  ngOnInit(){
    this.receiptsAll = this.receiptService.getAllReceipts()
    if(this.receiptsAll?.length) {
      this.selectReceipt = this.receiptsAll?.filter((item: Receipt) => item.id == Number(this.route.snapshot.paramMap.get('id')) ? item : null )[0]
    }
    this.formatDataForChart()
  }

  formatDataForChart(){
    if (this.selectReceipt) {
      this.DateGoodsGoogle = this.selectReceipt.goods.map((item: Goods )=> {return [item.name, item.price]});
    }
  }

  open(content: TemplateRef<any>) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult.set(`Closed with: ${result}`);
			},
			(reason) => {
				this.closeResult.set(`Dismissed ${this.getDismissReason(reason)}`);
			},
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


}
