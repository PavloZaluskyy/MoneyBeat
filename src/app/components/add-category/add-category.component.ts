import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Category } from '../../models/category';
import { LocalStorageService } from '../../services/local-storage.service';
import { CategoryService } from '../../services/category.service';
import { Client } from '../../models/client';
import { ClientService } from '../../services/client.service';
import { FormArray, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss'
})
export class AddCategoryComponent implements OnInit {
  numOfDigits: any = 4;
    @ViewChildren('inputs') inputs: QueryList<any> | any;
    confirmCodeForm: any;
    client: Client | undefined;
    messages: string = '';
    checkSign: boolean = false;
  isShowToast: boolean = false;
  categories: Category[] = [];
  categoryName: string = '';

  constructor(private _localStore: LocalStorageService, private _client: ClientService, private fb: FormBuilder, private router: Router,
    private _categoryService: CategoryService
  ){
    this.confirmCodeForm = this.fb.group({
      digits: this.fb.array([])
    });
  }

 ngOnInit(): void {
  for (let i = 0; i< this.numOfDigits; i++) {
                      (this.confirmCodeForm.get('digits') as FormArray).push(this.fb.control(null))
                    }
        this.client = this._client.getClient();
   this.categories = this._categoryService.getAllCategories()   
 }

 delete(id: number) {
  let arr = this.categories.filter(category => category.id !== id)
  this._categoryService.setCategories(arr)
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
  handleAddCategory(){
    if(!this.categoryName.trim()) {
      alert('Введіть назву категорії')
      return false;
    }
    let arr = this.categories.filter(category => category.name === this.categoryName.trim())
    if(arr.length) {
      alert("Вже існує ця категорія!")
      return false;
    }
    this.categories.push({id: this.categories.length+1, name: this.categoryName.trim()})

    this._categoryService.setCategories(this.categories);
    // M.toast({html: 'Категорія додана', classes: 'rounded'})
    this.isShowToast = !this.isShowToast;
    this.categoryName = "";
    return true
  }

}
