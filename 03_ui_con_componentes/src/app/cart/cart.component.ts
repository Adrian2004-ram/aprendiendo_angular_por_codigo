import { Component, input } from '@angular/core';
import { Product } from '../product';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  cart = input<{ product: Product, quantity: number }[]>();

}
