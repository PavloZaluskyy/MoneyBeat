import { Component, OnInit } from '@angular/core';
import { Category } from '../../models/category';
import { LocalStorageService } from '../../services/local-storage.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss'
})
export class AddCategoryComponent implements OnInit {
  isShowToast: boolean = false;
  categories: string[] = [];
  categoryName: string = '';

  constructor(private _localStore: LocalStorageService,
    private _categoryService: CategoryService
  ){}

 ngOnInit(): void {
   this.categories = this._categoryService.getAllCategories()
 }
  handleAddCategory(){
    if(!this.categoryName.trim()) {
      alert('Введіть назву категорії')
      return false;
    }
    if(this.categories.includes(this.categoryName.trim())) {
      alert("Вже існує ця категорія!")
      return false;
    }
    this.categories.push(this.categoryName.trim())

    this._categoryService.setCategories(this.categories);
    // M.toast({html: 'Категорія додана', classes: 'rounded'})
    this.isShowToast = !this.isShowToast;
    this.categoryName = "";
    return true
  }

}
