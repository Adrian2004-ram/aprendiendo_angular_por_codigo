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

  cart: {product: Product, quantity: number}[] = [];

  onSelect(product: Product) {
    this.selectedProduct = product;
    console.log(`Selected product: ${product.title}`);
  }

  onAdded() {
  
    const cartItem: {product: Product, 
                    quantity: number}[] = this.cart.filter( cartItem => cartItem.product.id === this.selectedProduct?.id  )
                              .map(cartItem => {  
                                    cartItem.quantity += 1;
                                    return cartItem;
                              });
    if (cartItem.length === 0) {
      this.cart.push({product: this.selectedProduct!, quantity: 1});
    }

  }

}
