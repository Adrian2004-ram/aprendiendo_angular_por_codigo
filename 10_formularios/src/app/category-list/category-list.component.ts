import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { CategoryCreateComponent } from "../category-create/category-create.component";
import { CategoryStateService } from '../category-state.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchBarComponent } from '../search-bar/search-bar.component';


@Component({
  selector: 'app-category-list',
  imports: [CategoryCreateComponent, SearchBarComponent],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent {

  private destroyRef = inject(DestroyRef);
  private categoryStateService = inject(CategoryStateService);
  categories: {id: number, name: string}[] = [];
  termSearch = '';
  categoriesSearchResult: {id: number, name: string}[] = [];

  ngOnInit() {
    this.categoryStateService.categories$
    //pipe takeUntilDestroyed destroyRef: cuando el componente se destruye, la suscripción se cancela (unsubscribe) inmediatamente.
    .pipe(takeUntilDestroyed(this.destroyRef)) 
    .subscribe( categories => {
        this.categories = categories;
        this.onSearch(this.termSearch);
        console.log('categories:', this.categories);
    });
  }

  showCategoryCreate = false;

  onCategoryCreated(categoryName: any) {

    categoryName = categoryName as string;
    const newCategory = {
      id: this.categories.length + 1,
      name: categoryName
    };
    this.categoryStateService.addCategory(categoryName);
    this.showCategoryCreate = false;
    
  }

  onSearch(term: string) {
    this.termSearch = term.toLocaleLowerCase();
    if (term.length >= 3) {
      this.categoriesSearchResult = this.categories.filter( cat => cat.name.toLowerCase().includes(this.termSearch));
      console.log(`Filtrado por ${this.termSearch}: [${this.categoriesSearchResult}] `);
    } else  {
      this.categoriesSearchResult = this.categories; 
    }
  }

}
