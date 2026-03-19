# CHANGELOG - Implementación del Carrito de Compras

## Resumen
Se implementó un componente hijo `cart` que recibe productos desde el componente padre `product-list`. Los productos se traspasan como un array de input, y la cantidad se incrementa cada vez que se selecciona el mismo producto.

---

## Cambios Realizados

### 1. Nueva Interfaz CartItem (`src/app/product.ts`)

Se agregó una nueva interfaz `CartItem` que extiende `Product` con una propiedad `quantity`:

```typescript
export interface CartItem extends Product {
  quantity: number;
}
```

**Propósito**: Representar un producto en el carrito con su cantidad correspondiente.

---

### 2. Nuevo Componente Cart (`src/app/cart/`)

Se creó el componente `cart` con tres archivos:

#### `cart.component.ts`
- Define un **input** llamado `items` de tipo `CartItem[]`
- Utiliza la nueva sintaxis de signals de Angular (`input()`)

```typescript
export class CartComponent {
  items = input<CartItem[]>([]);
}
```

#### `cart.component.html`
- Muestra la lista de productos en el carrito
- Cada item muestra: nombre del producto y cantidad (x{n})
- Muestra el total de items únicos en el carrito

#### `cart.component.css`
- Estilos básicos para el contenedor del carrito
- Diseño de lista con separación entre producto y cantidad

---

### 3. Modificación en ProductDetail (`src/app/product-detail/product-detail.component.ts`)

**Cambio realizado:**
- El output `added` ahora emite el `Product` en lugar de vacío
- El método `addToCart()` ahora pasa el producto al emit:

```typescript
added = output<Product>();

addToCart() {
  this.added.emit(this.product()!);
}
```

**Propósito**: Permitir que el componente padre reciba el producto seleccionado para agregarlo al carrito.

---

### 4. Modificación en ProductList (`src/app/product-list/product-list.component.ts`)

**Cambios realizados:**

1. **Importaciones**: Se agregó `CartItem` y `CartComponent`

2. **Nueva propiedad `cartItems`**:
   ```typescript
   cartItems: CartItem[] = [];
   ```

3. **Nueva lógica en `onAdded(product: Product)`**:
   ```typescript
   onAdded(product: Product) {
     const existingItem = this.cartItems.find(item => item.id === product.id);
     if (existingItem) {
       existingItem.quantity += 1;
     } else {
       this.cartItems.push({ ...product, quantity: 1 });
     }
   }
   ```

   **Lógica**:
   - Si el producto ya existe en el carrito → incrementa la cantidad en 1
   - Si el producto no existe → lo agrega con cantidad 1

4. **Se eliminó**: El `alert()` que mostraba el mensaje de "added to cart"

---

### 5. Actualización del Template (`src/app/product-list/product-list.component.html`)

**Cambios realizados:**

1. **Event binding actualizado**:
   ```html
   (added)="onAdded($event)"
   ```
   Ahora recibe el producto emitido desde `product-detail`.

2. **Nuevo componente cart**:
   ```html
   <app-cart [items]="cartItems"></app-cart>
   ```
   Pasa el array `cartItems` como input al componente cart.

---

## Flujo de Datos

```
User clicks product → selectedProduct
User clicks "Add to cart" → product-detail emits product
                                    ↓
                            product-list receives $event
                                    ↓
                            onAdded(product) processes:
                              - Check if exists in cartItems
                              - Increment quantity or add new
                                    ↓
                            cartItems array updated
                                    ↓
                            cart component receives updated items via input
                                    ↓
                            Cart displays updated list
```

---

## Cómo Funciona

1. El usuario selecciona un producto de la lista
2. El componente `product-detail` muestra el producto seleccionado
3. Al hacer clic en "Add to cart", se emite el producto
4. `product-list` recibe el producto y:
   - Si ya está en el carrito: incrementa `quantity += 1`
   - Si no está: lo agrega con `quantity = 1`
5. El componente `cart` recibe el array actualizado y renderiza la lista

---

## Archivos Modificados/Creados

| Archivo | Acción |
|---------|--------|
| `src/app/product.ts` | Modificado - Agregada interfaz CartItem |
| `src/app/cart/cart.component.ts` | Creado |
| `src/app/cart/cart.component.html` | Creado |
| `src/app/cart/cart.component.css` | Creado |
| `src/app/product-detail/product-detail.component.ts` | Modificado - Output emite Product |
| `src/app/product-list/product-list.component.ts` | Modificado - Lógica del carrito |
| `src/app/product-list/product-list.component.html` | Modificado - Template actualizado |
