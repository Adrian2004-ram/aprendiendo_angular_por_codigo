import { Component, input, SimpleChanges } from '@angular/core';
import { Product } from '../product';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  cart: { product: Product, quantity: number }[] = [];

  addedproduct = input<Product>();
  triggerAddPRoduct = input<boolean>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['triggerAddPRoduct'] && !changes['triggerAddPRoduct'].isFirstChange()) {
      const product = this.addedproduct;
      if (product()) {
        const existingProduct = this.cart.find(item => item.product.id === product()!.id);
        if (existingProduct) {
          existingProduct.quantity++;
        } else {
          this.cart.push({ product: product()!, quantity: 1 });
        }
      } else {
        console.warn('No product to add to the cart');
      } 
    }
}

}
