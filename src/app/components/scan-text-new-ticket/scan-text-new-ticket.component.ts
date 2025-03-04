import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  OperatorFunction,
} from 'rxjs';
import { ReceiptService } from '../../services/receipt.service';
import { Receipt } from '../../models/receipt';
import {
  ModalDismissReasons,
  NgbDateStruct,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { Good } from '../../models/good';
import { Category } from '../../models/category';
import { GoodsService } from '../../services/goods.service';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';
declare var Tesseract: any;
@Component({
  selector: 'app-scan-text-new-ticket',
  templateUrl: './scan-text-new-ticket.component.html',
  styleUrl: './scan-text-new-ticket.component.scss',
})
export class ScanTextNewTicketComponent implements OnInit {
  parsedData: any = null;
  message: string | null = null;
  imageFile: File | null = null;
  imageSrc: any = '';

  loader: { status: string; progres: number; isReady: boolean } = {
    status: 'Lol',
    progres: 1,
    isReady: true,
  };

  searchAllStore: { name: string; adress: string }[] = [];
  allReceipt: Receipt[] = [];
  modelDate: NgbDateStruct | undefined;
  currentDate = new Date();
  private modalService = inject(NgbModal);
  closeResult = '';
  date: { year: number; month: number } | undefined;
  searchAllGood: Good[] = [];
  searchAllCategory: Category[] = [];
  messageValid: string = '';
  isValidForm: { nameStore: boolean; adressStore: boolean } = {
    nameStore: true,
    adressStore: true,
  };
  log: string[] = [];
  isTogleLog: boolean = false;

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      this.readURL(event);
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

  isReady(res: { status: string; progress: number }): boolean {
    if (res.progress >= 0.9) {
      this.loader.isReady = true;
      return true;
    }
    this.loader.progres = res.progress;
    this.loader.status = res.status;
    this.loader.isReady = false;
    return false;
  }
  readURL(event: Event | any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = (e) => (this.imageSrc = reader.result);

      reader.readAsDataURL(file);
    }
  }

  constructor(
    private _receiptService: ReceiptService,
    private _goodsService: GoodsService,
    private _categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.allReceipt = this._receiptService.getAllReceipts();
    this.searchAllStore = this._receiptService.getAllStore(this.allReceipt);
    this.searchAllGood = this._goodsService.getAllGoods();
    this.searchAllCategory = this._categoryService.getAllCategories();
  }
  async processReceipt() {
    if (!this.imageFile) {
      alert('Будь ласка завантажте файл чеку');

      return;
    }
    let qq: any;
    qq = Tesseract.recognize(this.imageFile, 'ukr')
      .progress((res: { status: string; progress: number }) => {
        this.isReady(res);
      })
      .then((res: any) => {
        this.extractReceiptData(res.text);
      })
      .catch(console.error);
  }

  extractReceiptData(text: string) {
    const lines = text.split('\n');
    this.log = lines;
    const items: any[] = [];
    let storeName: string = '';
    let matchBuyDate;
    let buyDate;
    let storeAdress;
    let matchStoreAdress;
    lines.forEach((line) => {
      const matchItem = line.match(/(.+?)\s+(\d+)\s+([\d,]+\.\d{2})/); ///(\w+)\s + (\d+(\.\d{1,2})?)/
      storeName = lines[0].trim();
      matchStoreAdress = line.match(/вул\.\s*(.*?)(?=\n|$)/);
      matchBuyDate = line.match(
        /\b(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})\b|\b(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})\b/g
      ); // /(\d{2}-\d{2}-\d{4})/

      if (matchStoreAdress) {
        storeAdress = matchStoreAdress[0];
      } else {
        storeAdress = '';
      }
      if (matchBuyDate) {
        buyDate = matchBuyDate[0];
      } else {
        buyDate = 'Нажаль сканер не найшов дати в чеку';
      }
      if (matchItem) {
        items.push({
          name: matchItem[1],
          quantity: matchItem[2],
          price: matchItem[3],
        }); // така хуйня
      }
    });
    this.parsedData = {
      storeName: storeName,
      storeAdress: storeAdress,
      buyDate: buyDate,
      items: items,
      totalAmound: items.reduce((acc, item) => acc + parseFloat(item.price), 0),
    };
    this.message = 'Квитанцію успішно оброблено!';
  }

  onSubmit() {
    this.parsedData = null;
    this.imageFile = null;
  }

  searchStore: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
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
              .slice(0, 10)
      )
    );

  parseAddres() {
    const findElement =
      this.searchAllStore.find((item) =>
        item.name === this.parsedData.storeName ? item.adress : ''
      )?.adress || undefined;
    if (findElement) {
      this.parsedData.storeAdress = findElement;
    }
  }
  searchGood: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
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
              .slice(0, 10)
      )
    );
  parseCategoryGood(name: string, index: number) {
    const findElement =
      this.searchAllGood.find((item) =>
        item.name === name ? item.category : ''
      )?.category || undefined;
    if (findElement) {
      this.parsedData.items[index].category = findElement;
    }
  }
  searchCategory: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
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
              .slice(0, 10)
      )
    );

  refresh(index: number) {
    this.parsedData.items[index].name = '';
    this.parsedData.items[index].quantity = '';
    this.parsedData.items[index].category = '';
    this.parsedData.items[index].price = '';
  }

  delete(index: number) {
    if (this.parsedData.items.length > 1) {
      this.parsedData.items.splice(index, 1);
    }
  }
  addNewGood() {
    this.parsedData.items.push({
      name: '',
      quantity: '',
      price: '',
      category: '',
    });
  }
  getTotalAmound(): number {
    return this.parsedData.items.length
      ? this.parsedData.items.reduce(
          (acc: any, curr: any) => +acc + +curr.price,
          0
        )
      : 0;
  }
  sentReceipt() {
    const newReceipt: Receipt = {
      id: this.allReceipt.length + 1,
      nameStore: this.parsedData.storeName,
      adressStore: this.parsedData.storeAdress,
      date: this.modelDate?.day
        ? this.modelDate?.day +
          '.' +
          this.modelDate?.month +
          '.' +
          this.modelDate?.year
        : this.currentDate,
      goods: this.parsedData.items,
      totalAmaund: this.getTotalAmound(),
    };
    this.allReceipt.push(newReceipt);
    this._receiptService.setReceipt(this.allReceipt);
    this._goodsService.firstSetLocalGoods(this.allReceipt);
    this.router.navigateByUrl('');
    // } else {
    // 	alert("Error")
    // }
  }
  toggleLog() {
    this.isTogleLog = !this.isTogleLog;
  }
}
