import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryStateService {

  private categories = [{id: 1, name: 'Electrónica'},{id: 2, name: 'Videojuegos'},{id: 3, name: 'PCs'}];

  readonly categoriesSource = new BehaviorSubject<{id: number, name: string}[]>(this.categories);

  readonly categories$ = this.categoriesSource.asObservable();


  constructor() {

  }

  addCategory(category :string) {

    this.categories= [...this.categories, {id: this.categories.length+1, name: category}];
    this.categoriesSource.next(this.categories);

  }

}
