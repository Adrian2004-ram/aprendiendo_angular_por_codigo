import { Component, input } from '@angular/core';
import { CartItem } from '../product';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  items = input<CartItem[]>([]);
}
