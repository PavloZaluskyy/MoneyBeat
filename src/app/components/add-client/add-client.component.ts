import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Client } from '../../models/client';
import { ClientService } from '../../services/client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrl: './add-client.component.scss'
})
export class AddClientComponent implements OnInit, OnDestroy {
  numOfDigits: any = 4;
  @ViewChildren('inputs') inputs: QueryList<any> | any;
  confirmCodeForm: any;
  @Output() onChange = new EventEmitter()


  active = 1;
  name: string = '';
  moneyInCard: string = '';
  checkSign: boolean = false;
  isValidation: {name: boolean, moneyInCard: boolean} = {name: false, moneyInCard: false}

  constructor(private fb: FormBuilder, private _clientService: ClientService, private router: Router,
  ) {
    this.confirmCodeForm = this.fb.group({
      digits: this.fb.array([])
    });
  }

  createClient(){
    // console.log(this.confirmCodeForm.value);
    console.log(this.moneyInCard);
    if(this.isValidation.name && this.isValidation.moneyInCard) {
      let client: Client = {
        name: this.name,
        moneyInCard: +this.moneyInCard,
        pin: this.confirmCodeForm.value.digits.join('')? this.confirmCodeForm.value.digits.join('') : 1008,
        checkSign: this.checkSign
      }
      console.log(client);
      this._clientService.setClient(client)
      // this.router.navigateByUrl('');
      this.active = 4;
    }
    
  }
  isGoToManual(confirm: boolean) {
    if(confirm) {
      this.router.navigateByUrl('manual')
      this.onChange.emit(false)

    } else {
      console.log('go to home');
      this.onChange.emit(false)

      this.router.navigateByUrl('')
    }
  }

  ngOnInit() {
    for (let i = 0; i< this.numOfDigits; i++) {
      (this.confirmCodeForm.get('digits') as FormArray).push(this.fb.control(null))
    }
  }
  ngOnDestroy(): void {
    this.router.navigateByUrl('')
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
  }

  validationForm(){
    if(!this.name.trim()){
      this.isValidation.name = false;
      console.log( this.isValidation.name);
    }else {
      this.isValidation.name = true;
    }
    if(!this.moneyInCard){
      console.log("money is empty");
      
      this.isValidation.moneyInCard = false
    } else{
      console.log("money is true");
      
      this.isValidation.moneyInCard = true;
    }
    
  }

  nextStep(step: number){
    this.active = step
  }
}
