import { Injectable } from '@angular/core';
import { Category } from '../models/category';
import { LocalStorageService } from './local-storage.service';

const BASES_CATEGORIES: string[] = [
  "Продукти",
  "Сигарети",
  "Одяг",
  "Нова Пошта",
  "Проїзд",
  "Товари для дому",
  "Зняття готівки",
  "Аксесуари",
  "Поповнення мобільного",
  "Оренда житла",
  "Комуналка",
  "Кредит",
  "Переказ на картку",
  "Матеріали для творчості",
  "Краса",
  "Інше",
  "Здоров'я",
  "Вилазки по місту",
  "Аліекспрес",
  "Ремонт",
  "АЗС",
  "Додаткові витрати",
  "Корм тваринам",
  "Подарунки"
]

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  categories: string[] = [];

  constructor(private _localStorage: LocalStorageService) { }

  getAllCategories(){
    const res = this._localStorage.getItem("money-beat:categories");
    if(res) {
      return JSON.parse(res)
    }
    const defaultCategory: Category[] = []
    BASES_CATEGORIES.forEach((val: string, i) => defaultCategory.push({id: i + 1, name: val}))
    return defaultCategory;

  }
  setCategories(categories: Category[]) {
    if(categories.length)
      return this._localStorage.setItem("money-beat:categories", categories)
  }
}
