import { Component } from '@angular/core';
import { Category } from '../../category';
import { CategoryCreateComponent } from '../category-create/category-create.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-category-list',
  imports: [CategoryCreateComponent, SearchBarComponent],
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

  filteredCategories: Category[] = [...this.categories];

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
  }

  onCategoryCreated(category: Category): void {
    this.categories.push(category);
    this.filteredCategories = [...this.categories];
    this.showCreateForm = false;
  }

  onSearch(searchText: string): void {
    if (!searchText.trim()) {
      this.filteredCategories = [...this.categories];
    } else {
      const lower = searchText.toLowerCase();
      this.filteredCategories = this.categories.filter(c =>
        c.name.toLowerCase().includes(lower)
      );
    }
  }
}
