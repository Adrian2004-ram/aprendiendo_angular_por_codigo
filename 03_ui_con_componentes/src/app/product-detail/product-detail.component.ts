import { Component, input, output } from '@angular/core';
import { Product } from '../product';

@Component({
  selector: 'app-product-detail',
  imports: [],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
<<<<<<< HEAD
  product = input<Product>();
  added = output<Product>();
=======
  product = input<Product | undefined>();
  added = output();
>>>>>>> a658a59871daddd562c40ae8145f46b3002dc7c5

  addToCart() {
    this.added.emit(this.product()!);
  }
}
