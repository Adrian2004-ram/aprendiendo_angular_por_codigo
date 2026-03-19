import { Component } from '@angular/core';
import { Category } from '../../category';
import { CategoryCreateComponent } from '../category-create/category-create.component';

@Component({
  selector: 'app-category-list',
  imports: [CategoryCreateComponent],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent {
  showCreateForm = false;

  categories: Category[] = [
    { id: 1, name: 'Electrónica' },
    { id: 2, name: 'Ropa' },
    { id: 3, name: 'Libros' },
    { id: 4, name: 'Hogar' }
  ];

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
  }

  onCategoryCreated(category: Category): void {
    this.categories.push(category);
    this.showCreateForm = false;
  }
}
