import { Component, DestroyRef, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '../products.service';
import { priceMaximumValidator } from '../price-maximum.validator';
import { CategoryStateService } from '../category-state.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-create',
  imports: [ReactiveFormsModule],
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.css'
})
export class ProductCreateComponent {

  private destroyRef = inject(DestroyRef);
  private categoryStateService = inject(CategoryStateService);
  categories: {id: number, name: string}[] = [];

  productForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: Validators.required
    }),
    price: new FormControl<number | undefined>(undefined, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(1),
        priceMaximumValidator(1000)
      ]
    }),
    category: new FormControl('', { nonNullable: true })
  });   
  
  constructor(private productsService: ProductsService, private router: Router) {}  
  
  ngOnInit() {
    this.categoryStateService.categories$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe( categories => {
                    this.categories = categories;
                    console.log('categories:', this.categories);
                });
  }

  createProduct() {
    this.productsService.addProduct(this.productForm!.value).subscribe(() => {
      this.router.navigate(['/products']);
    });
  }

}
