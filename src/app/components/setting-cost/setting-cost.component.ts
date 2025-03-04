import {
  Component,
  OnInit,
  QueryList,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { Client } from '../../models/client';
import { ClientService } from '../../services/client.service';
import { FormArray, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ReceiptService } from '../../services/receipt.service';
import { Receipt } from '../../models/receipt';

@Component({
  selector: 'app-setting-cost',
  templateUrl: './setting-cost.component.html',
  styleUrl: './setting-cost.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SettingCostComponent implements OnInit {
  numOfDigits: any = 4;
  @ViewChildren('inputs') inputs: QueryList<any> | any;
  confirmCodeForm: any;
  client: Client | undefined;
  messages: string = '';
  checkSign: boolean = false;
  allReceipt: Receipt[] = [];
  constructor(
    private _client: ClientService,
    private fb: FormBuilder,
    private router: Router,
    private _receiptService: ReceiptService
  ) {
    this.confirmCodeForm = this.fb.group({
      digits: this.fb.array([]),
    });
  }

  delete(id: number) {
    let a = this.allReceipt.filter((receipt: Receipt) => receipt.id !== id);
    this._receiptService.setReceipt(a);
  }

  ngOnInit(): void {
    for (let i = 0; i < this.numOfDigits; i++) {
      (this.confirmCodeForm.get('digits') as FormArray).push(
        this.fb.control(null)
      );
    }
    this.client = this._client.getClient();
    this.allReceipt = this._receiptService.getAllReceipts();
  }

  signIn() {
    if (this.client?.pin == this.confirmCodeForm.value.digits.join('')) {
      this.messages = '';
      this.checkSign = true;
    } else {
      this.messages = 'Не правильний PIN-CODE';
      this.checkSign = false;
    }
  }

  check(index: any, field: any, event: any) {
    if (isNaN(parseInt(event.key, 10)) && event.key !== 'Backspace') {
      event.preventDefault();
    }
    if (field.value && event.key !== 'Backspace') {
      if (index < this.inputs.toArray().length - 1) {
        this.inputs.toArray()[index + 1].nativeElement.focus();
      }
    } else if (event.key === 'Backspace') {
      if (index > 0) {
        field.setValue(null);
        this.inputs.toArray()[index - 1].nativeElement.focus();
      }
    }
    this.signIn();
  }
}
