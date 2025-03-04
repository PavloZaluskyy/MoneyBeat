import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Client } from '../../models/client';
import { Earning } from '../../models/earning';
import { ClientService } from '../../services/client.service';
import { FormArray, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { EarningsService } from '../../services/earnings.service';

@Component({
  selector: 'app-setting-earning',
  templateUrl: './setting-earning.component.html',
  styleUrl: './setting-earning.component.scss',
})
export class SettingEarningComponent implements OnInit {
  numOfDigits: any = 4;
  @ViewChildren('inputs') inputs: QueryList<any> | any;
  confirmCodeForm: any;
  client: Client | undefined;
  messages: string = '';
  checkSign: boolean = false;
  allEarning: Earning[] = [];
  constructor(
    private _client: ClientService,
    private fb: FormBuilder,
    private router: Router,
    private _earningService: EarningsService
  ) {
    this.confirmCodeForm = this.fb.group({
      digits: this.fb.array([]),
    });
  }
  ngOnInit(): void {
    for (let i = 0; i < this.numOfDigits; i++) {
      (this.confirmCodeForm.get('digits') as FormArray).push(
        this.fb.control(null)
      );
    }
    this.client = this._client.getClient();
    this.allEarning = this._earningService.getAllEarnings();
  }
  delete(id: number) {
    let a = this.allEarning.filter((earning: Earning) => earning.id !== id);
    this._earningService.setEarning(a);
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
