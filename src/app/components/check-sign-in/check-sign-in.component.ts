import { Component, EventEmitter, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { Router } from '@angular/router';
import { Client } from '../../models/client';

@Component({
  selector: 'app-check-sign-in',
  templateUrl: './check-sign-in.component.html',
  styleUrl: './check-sign-in.component.scss'
})
export class CheckSignInComponent implements OnInit{
  numOfDigits: any = 4;
  @ViewChildren('inputs') inputs: QueryList<any> | any;
  confirmCodeForm: any;
  client: Client | undefined;
  messages: string = '';
  @Output() onChange = new EventEmitter()
  constructor(private fb: FormBuilder, private _clientService: ClientService, private router: Router,
    ) {
      this.confirmCodeForm = this.fb.group({
        digits: this.fb.array([])
      });
    }
    ngOnInit() {
        for (let i = 0; i< this.numOfDigits; i++) {
          (this.confirmCodeForm.get('digits') as FormArray).push(this.fb.control(null))
        }
        this.client = this._clientService.getClient()
      }
      signIn(){
        console.log(Number(this.confirmCodeForm.value.digits.join('')));
        
        if(this.client?.checkSign){
          if (this.client.pin == this.confirmCodeForm.value.digits.join('')) {
            console.log("signIn succesfull");
            this.messages = '';
            this.router.navigateByUrl('');
            this.onChange.emit(false)
            
          }else{ this.messages = 'Не правильний PIN-CODE'
          }
        }else{
          console.log('404');
          this.messages = 'Щось трапилося не так('
          
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
}

