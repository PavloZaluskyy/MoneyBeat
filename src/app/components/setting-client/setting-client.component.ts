import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Client } from '../../models/client';
import { ClientService } from '../../services/client.service';
import { FormArray, FormBuilder } from '@angular/forms';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-setting-client',
  templateUrl: './setting-client.component.html',
  styleUrl: './setting-client.component.scss'
})
export class SettingClientComponent implements OnInit{

  client: Client | any;
  checkSign: boolean = false;

   numOfDigits: any = 4;
    @ViewChildren('inputs') inputs: QueryList<any> | any;
    confirmCodeForm: any;
   // client: Client | undefined;
    messages: string = '';
    isValidation: {name: boolean; moneyInCard: boolean; } = {name: true, moneyInCard: true}
  constructor(private _client: ClientService, private fb: FormBuilder, private router: Router){
    this.confirmCodeForm = this.fb.group({
      digits: this.fb.array([])
    });
  }

  ngOnInit(): void {
    for (let i = 0; i< this.numOfDigits; i++) {
              (this.confirmCodeForm.get('digits') as FormArray).push(this.fb.control(null))
            }
    this.client = this._client.getClient()
  }

  signIn(){
    if(this.client?.pin == this.confirmCodeForm.value.digits.join('')) {
      console.log("signIn succesfull");
      this.messages = '';
     this.checkSign = true
      
    }else{ this.messages = 'Не правильний PIN-CODE'
      this.checkSign = false
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
    }
    else if (event.key === 'Backspace') {
      if (index > 0) {
        field.setValue(null)
        this.inputs.toArray()[index - 1].nativeElement.focus();
      } else {
        console.log('first field');
      }
    }
    this.signIn()
  }

  validation(){
    if(!this.client?.name.trim()) {
      return false;
    }
    if(!this.client?.moneyInCard){
      return false;
    }
    return true;
  }

  save(){
    if(this.validation()){
      console.log(this.client);
      this._client.setClient({name: this.client.name, moneyInCard: this.client.moneyInCard, pin: this.client.pin ? this.client.pin : 1008, checkSign: this.client.checkSign})
      this.router.navigateByUrl('')
    }
  }
}
