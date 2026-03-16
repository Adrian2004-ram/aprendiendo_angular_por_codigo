import { ChangeDetectorRef, Component } from '@angular/core';
import { CategoryCreateComponent } from "../category-create/category-create.component";


@Component({
  selector: 'app-category-list',
  imports: [CategoryCreateComponent],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent {


  showCategoryCreate = false

  categories: { id: number, name: string }[] = [ 
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Clothing' },
    { id: 3, name: 'Books' }
  ];

  onCategoryCreated(categoryName: any) {

    categoryName = categoryName as string;
    const newCategory = {
      id: this.categories.length + 1,
      name: categoryName
    };
    this.categories.push(newCategory);
    this.showCategoryCreate = false;
    
  }

}
