import { Component } from '@angular/core';
import { Product, CartItem } from '../product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { CartComponent } from '../cart/cart.component';

@Component({
  selector: 'app-product-list',
  imports: [ProductDetailComponent, CartComponent],
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
  cartItems: CartItem[] = [];

<<<<<<< HEAD
  onAdded(product: Product) {
    const existingItem = this.cartItems.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cartItems.push({ ...product, quantity: 1 });
    }
=======
  onSelect(product: Product) {
    this.selectedProduct = product;
    console.log(`Selected product: ${product.title}`);
  }

  onAdded() {
    alert(`${this.selectedProduct?.title} added to the cart!`);
>>>>>>> a658a59871daddd562c40ae8145f46b3002dc7c5
  }
}
