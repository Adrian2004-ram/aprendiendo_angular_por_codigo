import { Component } from '@angular/core';
import { Product } from '../product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { CartComponent } from '../cart/cart.component';
import fi from '@angular/common/locales/extra/fi';

@Component({
  selector: 'app-product-list',
  imports: [CartComponent, ProductDetailComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  
  products: Product[] = [
    { id: 1, title: 'Keyboard'},
    { id: 2, title: 'Microphone' },
    { id: 3, title: 'Web camera' },
    { id: 4, title: 'Tablet' }
  ];

  selectedProduct: Product | undefined;

  triggerAddPRoduct: boolean = false;

  onSelect(product: Product) {
    this.selectedProduct = product;
    console.log(`Selected product: ${product.title}`);
  }

  onAdded() {
    this.triggerAddPRoduct = !this.triggerAddPRoduct;
  }

}
