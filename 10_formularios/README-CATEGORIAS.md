# Exposición: Gestión de Categorías con Angular

## Angular 19 - Formularios Reactivos y Comunicación Componente a Componente

---

# ÍNDICE

1. [Objetivos de la Práctica](#1-objetivos-de-la-práctica)
2. [Conceptos Teóricos](#2-conceptos-teóricos)
3. [Arquitectura del Proyecto](#3-arquitectura-del-proyecto)
4. [Implementación Paso a Paso](#4-implementación-paso-a-paso)
5. [Comunicación Hijo → Padre](#5-comunicación-hijo--padre)
6. [Formularios Reactivos](#6-formularios-reactivos)
7. [Demostración Práctica](#7-demostración-práctica)
8. [Diagrama de Flujo](#8-diagrama-de-flujo)
9. [Código Completo](#9-código-completo)
10. [Preguntas Frecuentes](#10-preguntas-frecuentes)

---

# 1. OBJETIVOS DE LA PRÁCTICA

## Objetivo Principal
Desarrollar un sistema de gestión de categorías en Angular 19 que demuestre:
- ✅ Componentes padre e hijo
- ✅ Comunicación mediante eventos (`output()`)
- ✅ Formularios reactivos
- ✅ Validaciones de formularios
- ✅ Routing en Angular

## Objetivos Específicos
Al finalizar esta práctica, el estudiante será capaz de:

| # | Objetivo | Evidencia |
|---|----------|-----------|
| 1 | Crear componentes con estructura padre-hijo | category-list contiene category-create |
| 2 | Implementar comunicación mediante `output()` | categoryCreated.emit() → onCategoryCreated() |
| 3 | Utilizar formularios reactivos | ReactiveFormsModule, FormGroup, FormControl |
| 4 | Aplicar validaciones | required, minLength |
| 5 | Gestionar estado con booleanos | showCreateForm toggle |
| 6 | Configurar rutas | /categories en app.routes.ts |

---

# 2. CONCEPTOS TEÓRICOS

## 2.1 ¿Qué es un Componente en Angular?

Un **componente** es un bloque fundamental de construcción en Angular que controla una porción de la pantalla (vista).

```
┌─────────────────────────────────────┐
│           APP COMPONENT             │
│  ┌─────────────────────────────┐   │
│  │     COMPONENTE PADRE         │   │
│  │  ┌───────────────────────┐  │   │
│  │  │   COMPONENTE HIJO     │  │   │
│  │  └───────────────────────┘  │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Estructura de un Componente Angular

```
mi-componente/
├── mi-componente.component.ts      # Lógica (TypeScript)
├── mi-componente.component.html    # Plantilla (HTML)
├── mi-componente.component.css     # Estilos (CSS)
```

## 2.2 Tipos de Componentes

### Componente Página (Ruta)
- Se carga cuando el usuario navega a una ruta
- Define en `app.routes.ts`
- Ejemplo: `CategoryListComponent` → `/categories`

### Componente Embebido
- Se incluye dentro de otro componente
- Se usa como etiqueta HTML: `<app-category-create>`
- Ejemplo: `CategoryCreateComponent` dentro de `CategoryListComponent`

## 2.3 Comunicación entre Componentes

Angular permite diferentes formas de comunicación:

```
┌─────────────────────────────────────────────────────────────┐
│                 COMUNICACIÓN EN ANGULAR                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PADRE → HIJO                                               │
│  ┌─────────┐      @Input()       ┌─────────┐                │
│  │  PADRE  │ ──────────────────► │   HIJO  │                │
│  └─────────┘                    └─────────┘                │
│                                                             │
│  HIJO → PADRE (HOY)                                        │
│  ┌─────────┐     output()        ┌─────────┐                │
│  │  PADRE  │ ◄────────────────── │   HIJO  │                │
│  └─────────┘                     └─────────┘                │
│                                                             │
│  Servicios (caso general)                                  │
│  ┌─────────┐                    ┌─────────┐                │
│  │ COMP A  │ ──── servicio ────► │ COMP B  │                │
│  └─────────┘                    └─────────┘                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### ¿Cuándo usar cada uno?

| Estrategia | Cuándo usarla |
|------------|---------------|
| `@Input()` | El padre pasa datos al hijo |
| `output()` | El hijo notifica eventos al padre |
| Servicios | Componentes no relacionados que comparten estado |

---

# 3. ARQUITECTURA DEL PROYECTO

## 3.1 Estructura de Archivos

```
src/app/
├── category.ts                              ← Modelo de datos
├── category/
│   ├── category-list/                       ← 📦 COMPONENTE PADRE
│   │   ├── category-list.component.ts      ← Lógica
│   │   ├── category-list.component.html     ← Vista
│   │   └── category-list.component.css     ← Estilos
│   └── category-create/                     ← 📦 COMPONENTE HIJO
│       ├── category-create.component.ts     ← Lógica
│       ├── category-create.component.html   ← Vista
│       └── category-create.component.css    ← Estilos
├── app.routes.ts                            ← Rutas
└── app.component.html                       ← Navegación
```

## 3.2 Diagrama de Componentes

```
┌──────────────────────────────────────────────────────────────────┐
│                        APP COMPONENT                             │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    HEADER / NAV                          │   │
│  │   [Products]  [Categories]  [My Cart]  [My Profile]     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    ROUTER OUTLET                         │   │
│  │                                                          │   │
│  │   Cuando navegas a /categories:                          │   │
│  │   ┌──────────────────────────────────────────────────┐  │   │
│  │   │            CATEGORY LIST COMPONENT                │  │   │
│  │   │                      (PADRE)                       │  │   │
│  │   │                                                  │  │   │
│  │   │  ┌────────────────────────────────────────────┐  │  │   │
│  │   │  │  Título: "Categorías (4)"                  │  │  │   │
│  │   │  │  Botón: [Nueva Categoría]                  │  │  │   │
│  │   │  └────────────────────────────────────────────┘  │  │   │
│  │   │                                                  │  │   │
│  │   │  ┌────────────────────────────────────────────┐  │  │   │
│  │   │  │        CATEGORY CREATE COMPONENT            │  │  │   │
│  │   │  │              (HIJO - EMBEBIDO)               │  │  │   │
│  │   │  │                                                │  │  │   │
│  │   │  │  ┌────────────────────────────────────────┐  │  │  │   │
│  │   │  │  │  Nombre: [_________________]            │  │  │  │   │
│  │   │  │  │  [Crear Categoría]                     │  │  │  │   │
│  │   │  │  └────────────────────────────────────────┘  │  │  │   │
│  │   │  │                                                │  │  │   │
│  │   │  └────────────────────────────────────────────┘  │  │   │
│  │   │                                                  │  │   │
│  │   │  ┌────────────────────────────────────────────┐  │  │   │
│  │   │  │  📋 Lista de Categorías:                   │  │  │   │
│  │   │  │     • Electrónica                          │  │  │   │
│  │   │  │     • Ropa                                 │  │  │   │
│  │   │  │     • Libros                               │  │  │   │
│  │   │  │     • Hogar                                │  │  │   │
│  │   │  └────────────────────────────────────────────┘  │  │   │
│  │   └──────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## 3.3 Flujo de Navegación

```
URL: http://localhost:4200/categories
         │
         ▼
┌─────────────────┐
│   app.routes.ts │
│                 │
│  /categories    │──────────► CategoryListComponent
│  /products      │──────────► ProductListComponent
│  /cart          │──────────► CartComponent
└─────────────────┘
```

---

# 4. IMPLEMENTACIÓN PASO A PASO

## Paso 1: Crear el Modelo de Datos

**Archivo:** `src/app/category.ts`

```typescript
export interface Category {
  id: number;
  name: string;
}
```

### Explicación:
- Usamos `interface` para definir la estructura de datos
- `id`: Identificador único (número)
- `name`: Nombre de la categoría (texto)

---

## Paso 2: Crear el Componente Hijo

### 2.1 TypeScript (Lógica)

**Archivo:** `category-create.component.ts`

```typescript
import { Component, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../category';

@Component({
  selector: 'app-category-create',
  imports: [ReactiveFormsModule],
  templateUrl: './category-create.component.html',
  styleUrl: './category-create.component.css'
})
export class CategoryCreateComponent {
  // ============================================
  // OUTPUT: Comunicar evento al padre
  // ============================================
  categoryCreated = output<Category>();

  // ============================================
  // FORMULARIO REACTIVO
  // ============================================
  categoryForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)]
    })
  });

  // ============================================
  // MÉTODO PARA CREAR CATEGORÍA
  // ============================================
  createCategory(): void {
    if (this.categoryForm.valid) {
      const newCategory: Category = {
        id: Date.now(),
        name: this.categoryForm.getRawValue().name.trim()
      };
      this.categoryCreated.emit(newCategory);
      this.categoryForm.reset();
    }
  }
}
```

### Desglose línea por línea:

```typescript
// 1. IMPORTACIONES
import { Component, output } from '@angular/core';
//                                              ↑
//              output es la API moderna para emitir eventos

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
//                          ↑           ↑                      ↑
//                      Para crear   Para agrupar       Para validar
//                      controles    controles          el formulario

// 2. DECORADOR @Component
@Component({
  selector: 'app-category-create',
  //                ↑───────────────────────────
  //   Se usa como etiqueta HTML: <app-category-create>
  //   
  imports: [ReactiveFormsModule],
  //         ↑─────────────────────
  //   Necesario para usar directivas de formularios reactivos
  //   (formGroup, formControlName, etc.)
  
  templateUrl: './category-create.component.html',
  styleUrl: './category-create.component.css'
})

// 3. CLASE DEL COMPONENTE
export class CategoryCreateComponent {
  
  // OUTPUT: Canal de comunicación hacia el padre
  categoryCreated = output<Category>();
  //         ↑───────────────
  //   output<T>() es una función que crea un output tipado
  //   Category es el tipo de dato que emitiremos
  
  // FORMULARIO REACTIVO
  categoryForm = new FormGroup({
    //              ↑────────
    //   FormGroup agrupa varios FormControl
    name: new FormControl('', {
    //        ↑─────────────────────
    //   Valor inicial vacío
      nonNullable: true,
      //   ↑────────────
      //   El control nunca será null (mejor tipado)
      validators: [Validators.required, Validators.minLength(3)]
      //                   ↑───────────────────
      //   Array de validadores
    })
  });
  
  // MÉTODO createCategory
  createCategory(): void {
    if (this.categoryForm.valid) {
      //                    ↑─────
      //   true si pasa todas las validaciones
      
      const newCategory: Category = {
        id: Date.now(),
        //   Genera un ID único basado en timestamp
        name: this.categoryForm.getRawValue().name.trim()
        //                        ↑───────────────────────────
        //   getRawValue() obtiene el valor aunque el control sea invalidado
        //   trim() elimina espacios al inicio/final
      };
      
      this.categoryCreated.emit(newCategory);
      //          ↑──────────────────────────
      //   EMITE el evento al padre con la categoría creada
      
      this.categoryForm.reset();
      //   Limpia el formulario después de crear
    }
  }
}
```

---

### 2.2 HTML (Plantilla)

**Archivo:** `category-create.component.html`

```html
<form [formGroup]="categoryForm" (ngSubmit)="createCategory()">
  <!--                                        ↑──────────────────
       [formGroup] vincula el formulario template al FormGroup del componente
       (ngSubmit) detecta cuando se envía el formulario
  -->
  
  <div class="form-group">
    <label for="categoryName">Nombre de la categoría:</label>
    
    <input 
      id="categoryName" 
      type="text" 
      formControlName="name"
      placeholder="Ej: Electrónica"
    />
    <!--
      formControlName="name" vincula este input al FormControl "name"
    -->
    
    <!-- VALIDACIONES: Mostrar errores solo si el campo fue tocado Y es inválido -->
    @if (categoryForm.get('name')?.invalid && categoryForm.get('name')?.touched) {
      <div class="error">
        @if (categoryForm.get('name')?.errors?.['required']) {
          <span>El nombre es obligatorio</span>
        }
        @if (categoryForm.get('name')?.errors?.['minlength']) {
          <span>Mínimo 3 caracteres</span>
        }
      </div>
    }
  </div>
  
  <button type="submit" [disabled]="categoryForm.invalid">
    <!--
      [disabled] mantiene el botón deshabilitado mientras el formulario sea inválido
    -->
    Crear Categoría
  </button>
</form>
```

---

### 2.3 CSS (Estilos)

**Archivo:** `category-create.component.css`

```css
form {
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Estilo para campo inválido que ha sido tocado */
input.ng-invalid.ng-touched {
  border-color: #dc3545;
}

.error {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

button {
  padding: 0.5rem 1rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover:not(:disabled) {
  background-color: #218838;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
```

---

## Paso 3: Crear el Componente Padre

### 3.1 TypeScript (Lógica)

**Archivo:** `category-list.component.ts`

```typescript
import { Component } from '@angular/core';
import { Category } from '../../category';
import { CategoryCreateComponent } from '../category-create/category-create.component';

@Component({
  selector: 'app-category-list',
  imports: [CategoryCreateComponent],
  //           ↑────────────────────────────────
  //   IMPORTANTE: Hay que importar el componente hijo
  //   para poder usarlo en el template
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent {
  
  // ============================================
  // ESTADO DEL COMPONENTE
  // ============================================
  
  // Controla la visibilidad del formulario hijo
  showCreateForm = false;
  //     ↑──────────────
  //   false = formulario oculto
  //   true  = formulario visible
  
  // Array de categorías con datos iniciales
  categories: Category[] = [
    { id: 1, name: 'Electrónica' },
    { id: 2, name: 'Ropa' },
    { id: 3, name: 'Libros' },
    { id: 4, name: 'Hogar' }
  ];
  
  // ============================================
  // MÉTODOS
  // ============================================
  
  // Toggle: mostrar/ocultar formulario
  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    //                     ↑
    //   Niega el valor actual (true↔false)
  }
  
  // RECIBE la categoría creada del hijo
  onCategoryCreated(category: Category): void {
    //      ↑──────────────────────────
    //   category viene del evento emitted por el hijo
    this.categories.push(category);
    //              ↑────────────────
    //   Añade la nueva categoría al array
    this.showCreateForm = false;
    //   Oculta el formulario después de crear
  }
}
```

### Desglose de imports:

```typescript
import { Category } from '../../category';
//                ↑──────────────────────────
//   Sube dos niveles (..) desde category-list/
//   para llegar a src/app/ y acceder a category.ts

import { CategoryCreateComponent } from '../category-create/category-create.component';
//                                            ↑─────────────────────────────────────
//   Sube un nivel (..) desde category-list/
//   luego entra a category-create/
```

### Ruta de imports:

```
src/app/
├── category.ts              ← import desde aquí
│                              (../../category = 2 niveles arriba)
│
└── category/
    ├── category-list/
    │   └── category-list.component.ts
    │                              ↑ nivel 1 (../)
    └── category-create/
        └── category-create.component.ts
                                   ↑ nivel 2 (../../)
```

---

### 3.2 HTML (Plantilla)

**Archivo:** `category-list.component.html`

```html
<!-- ========================================== -->
<!-- CABECERA: Título y Botón Toggle -->
<!-- ========================================== -->
<div class="header">
  <h1>Categorías ({{categories.length}})</h1>
  <!--                    ↑──────────────────
       Muestra el número de categorías en el título
  -->
  
  <button (click)="toggleCreateForm()">
    <!--    ↑────────────────────
         (click) detecta el clic en el botón
         toggleCreateForm() alterna showCreateForm
    -->
    {{ showCreateForm ? 'Cancelar' : 'Nueva Categoría' }}
    <!--  ↑────────────────────────────────────────────
         Operador ternario:
         - Si showCreateForm=true → "Cancelar"
         - Si showCreateForm=false → "Nueva Categoría"
    -->
  </button>
</div>

<!-- ========================================== -->
<!-- FORMULARIO HIJO (Condicional) -->
<!-- ========================================== -->
@if (showCreateForm) {
<!--  ↑───────────────────────
     Si showCreateForm es true, muestra el componente hijo
-->
  <app-category-create 
    (categoryCreated)="onCategoryCreated($event)" 
  />
  <!--  ↑──────────────────────────────────────────
        (categoryCreated) escucha el evento emitido por el hijo
                    ↓────────────────────
        $event contiene los datos emitidos (la nueva categoría)
        
        Equivale a:
        (categoryCreated)="onCategoryCreated($event)"
                            │
                            └─► onCategoryCreated(category: Category)
  -->
}

<!-- ========================================== -->
<!-- LISTA DE CATEGORÍAS -->
<!-- ========================================== -->
<ul class="category-list">
  @for (category of categories; track category.id) {
  <!--      ↑───────────────────────────────────────
        @for es la nueva sintaxis de Angular 17+
        equivalent a *ngFor
        
        track category.id optimiza el rendering
        identificando cada elemento por su id
  -->
    <li>{{ category.name }}</li>
  } @empty {
    <p>No hay categorías disponibles.</p>
  }
  <!--      ↑──────────────
        @empty se muestra cuando el array está vacío
  -->
</ul>
```

---

### 3.3 CSS (Estilos)

**Archivo:** `category-list.component.css`

```css
.header {
  display: flex;
  justify-content: space-between;
  /*  ↑─────────────────────────────
      Distribuye elementos a los extremos
      (título a la izquierda, botón a la derecha)
  */
  align-items: center;
  /*  ↑────────────────
      Centra verticalmente
  */
  margin-bottom: 1rem;
}

h1 {
  margin: 0;
}

button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-list li {
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
}

.category-list li:hover {
  background-color: #f5f5f5;
}
```

---

## Paso 4: Configurar las Rutas

**Archivo:** `src/app/app.routes.ts`

```typescript
import { Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CategoryListComponent } from './category/category-list/category-list.component';
//                                      ↑────────────────────────────────────────
//   IMPORTANTE: Hay que importar el componente para usarlo en las rutas
import { authGuard } from './auth.guard';
import { checkoutGuard } from './checkout.guard';
import { productsResolver } from './products.resolver';

export const routes: Routes = [
  // ... otras rutas ...
  
  // ═══════════════════════════════════════════════════════════════════
  // NUEVA RUTA PARA CATEGORÍAS
  // ═══════════════════════════════════════════════════════════════════
  { 
    path: 'categories', 
    component: CategoryListComponent 
  },
  //        ↑──────────────────────────────────────────────────────────
  //   localhost:4200/categories → muestra CategoryListComponent
  
  // ... resto de rutas ...
];
```

---

## Paso 5: Añadir Navegación

**Archivo:** `src/app/app.component.html`

```html
<header>
  <h2>{{ settings.title }}</h2>
  <span class="spacer"></span>
  
  <div class="menu-links">
    <a routerLink="/products" routerLinkActive="active">Products</a>
    <!--                                                    ↑
          routerLinkActive marca el enlace como "active" cuando estamos en esa ruta
    -->
    
    <a routerLink="/categories" routerLinkActive="active">Categories</a>
    <!--    ↑──────────────────────────────────────────────────────
          NUEVO ENLACE A CATEGORÍAS
    -->
    
    <a routerLink="/cart" routerLinkActive="active">My Cart</a>
    <a routerLink="/user" routerLinkActive="active">My Profile</a>
  </div>
  
  <app-auth></app-auth>
</header>
```

---

# 5. COMUNICACIÓN HIJO → PADRE

## 5.1 Concepto: Output con output()

La API `output()` permite que un componente hijo emita eventos que el componente padre puede escuchar.

```
┌─────────────────────────────────────────────────────────────┐
│                      ESQUEMA output()                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  HIJO (Emisor)                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                                                     │    │
│  │  categoryCreated = output<Category>()              │    │
│  │         │                                            │    │
│  │         ▼                                            │    │
│  │  ┌──────────────────────────────────────────────┐   │    │
│  │  │  function createCategory() {                 │   │    │
│  │  │    const cat = { id: 1, name: 'Nueva' };     │   │    │
│  │  │    categoryCreated.emit(cat);  ◄─────────┐  │   │    │
│  │  │  }                                    │    │   │    │
│  │  └──────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────┘    │
│                         │                                     │
│                         │ categoryCreated                     │
│                         │ (canal de comunicación)             │
│                         ▼                                     │
│  PADRE (Receptor)                                          │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                                                     │    │
│  │  <app-category-create                               │    │
│  │    (categoryCreated)="onCategoryCreated($event)">  │    │
│  │  </app-category-create>                             │    │
│  │              │                                      │    │
│  │              ▼                                      │    │
│  │  ┌──────────────────────────────────────────────┐   │    │
│  │  │  onCategoryCreated(category: Category) {    │   │    │
│  │  │    this.categories.push(category);  ◄───────┘   │    │
│  │  │  }                                              │   │
│  │  └──────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 5.2 API Moderna vs Clásica

### Forma Moderna (Angular 19+) ✅ RECOMENDADA

```typescript
// HIJO
import { Component, output } from '@angular/core';

@Component({...})
export class CategoryCreateComponent {
  categoryCreated = output<Category>();
  //         ↑──────────────────────
  //   Crea una señal de output tipado
}
```

### Forma Clásica (Aún funciona)

```typescript
// HIJO
import { Component, Output, EventEmitter } from '@angular/core';

@Component({...})
export class CategoryCreateComponent {
  @Output() categoryCreated = new EventEmitter<Category>();
  //  ▲────────                  ▲────────────────────────
  //  Decorador                  Instancia de EventEmitter
}
```

### ¿Por qué output() es mejor?

| Característica | output() | @Output + EventEmitter |
|----------------|----------|-------------------------|
| TypeScript | Mejor tipado | Tipado parcial |
| Señales | Compatible con señales | No compatible |
| Árbol de componentes | Más eficiente | Menos eficiente |
| Modernidad | ✅ Angular 19+ | Legacy |
| Recommended | ✅ Sí | No |

## 5.3 Flujo Completo de Datos

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              FLUJO DE DATOS                                   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. USUARIO ESCRIBE EN EL FORMULARIO                                         │
│     ┌────────────────────────────────────────────────────────────┐           │
│     │  Nombre: [Electrónica________]                              │           │
│     │  [Crear Categoría] (habilitado porque el formulario es     │           │
│     │  válido: no está vacío y tiene más de 3 caracteres)        │           │
│     └────────────────────────────────────────────────────────────┘           │
│                              │                                               │
│                              ▼                                               │
│  2. USUARIO HACE CLICK EN "Crear Categoría"                                  │
│     ┌────────────────────────────────────────────────────────────┐           │
│     │  <form (ngSubmit)="createCategory()">                      │           │
│     │               │                                           │           │
│     │               ▼                                           │           │
│     │  createCategory() {                                        │           │
│     │    if (this.categoryForm.valid) {  ✓ Formulario válido    │           │
│     │      const newCategory = {                                 │           │
│     │        id: 1712345678900,                                  │           │
│     │        name: 'Electrónica'                                 │           │
│     │      };                                                    │           │
│     │      this.categoryCreated.emit(newCategory);  ◄── EMITE   │           │
│     │    }                                                       │           │
│     │  }                                                         │           │
│     └────────────────────────────────────────────────────────────┘           │
│                              │                                               │
│                              │ categoryCreated.emit(newCategory)              │
│                              │                                               │
│                              ▼                                               │
│  3. PADRE RECIBE EL EVENTO                                                   │
│     ┌────────────────────────────────────────────────────────────┐           │
│     │  <app-category-create                                      │           │
│     │    (categoryCreated)="onCategoryCreated($event)">          │           │
│     │               │                        │                  │           │
│     │               │                        ▼                  │           │
│     │               │    onCategoryCreated(category) {           │           │
│     │               │      this.categories.push(category);       │           │
│     │               │      this.showCreateForm = false;          │           │
│     │               │    }                                       │           │
│     │               │                        │                  │           │
│     │               │                        ▼                  │           │
│     │               │    categories = [                         │           │
│     │               │      {id:1, name:'Electrónica'},  ← existed│           │
│     │               │      {id:2, name:'Ropa'},                 │           │
│     │               │      {id:3, name:'Libros'},               │           │
│     │               │      {id:4, name:'Hogar'},                │           │
│     │               │      {id:1712345678900, name:'Electrónic'}← NEW       │
│     │               │    ];                                     │           │
│     └────────────────────────────────────────────────────────────┘           │
│                              │                                               │
│                              ▼                                               │
│  4. ANGULAR ACTUALIZA LA VISTA                                               │
│     ┌────────────────────────────────────────────────────────────┐           │
│     │  Categorías (5)                                            │           │
│     │  [Nueva Categoría]                                         │           │
│     │                                                            │           │
│     │  • Electrónica                                             │           │
│     │  • Ropa                                                    │           │
│     │  • Libros                                                  │           │
│     │  • Hogar                                                   │           │
│     │  • Electrónica ← Se agregó automáticamente                │           │
│     └────────────────────────────────────────────────────────────┘           │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

# 6. FORMULARIOS REACTIVOS

## 6.1 ¿Qué son?

Los formularios reactivos son un enfoque para crear formularios en Angular donde el formulario y sus controles se definen en el componente (programáticamente), en lugar de definirlo en el HTML del template.

```
┌─────────────────────────────────────────────────────────────────┐
│                    FORMULARIOS REACTIVOS                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  TEMPLATE (HTML)                   COMPONENTE (TypeScript)       │
│  ┌─────────────────────┐          ┌─────────────────────────┐   │
│  │ <form [formGroup]=   │          │                        │   │
│  │   "categoryForm">    │  ←───    │ categoryForm = new     │   │
│  │                     │  vínculo   │   FormGroup({...})    │   │
│  │   <input            │          │                        │   │
│  │     formControlName= │  ←───    │   name: new FormControl│   │
│  │     "name">          │  vínculo   │   ('', {...})        │   │
│  │ </form>              │          │                        │   │
│  └─────────────────────┘          └─────────────────────────┘   │
│                                                                 │
│  Modelo de datos                                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  categoryForm: FormGroup                                │    │
│  │  │                                                       │    │
│  │  └── name: FormControl                                   │    │
│  │      │                                                   │    │
│  │      ├── value: string                                   │    │
│  │      ├── valid: boolean                                  │    │
│  │      ├── touched: boolean                                │    │
│  │      ├── dirty: boolean                                  │    │
│  │      └── errors: ValidationErrors | null                 │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 6.2 Componentes Clave

### FormGroup
Agrupador lógico de `FormControl`. Representa el formulario completo.

```typescript
const myForm = new FormGroup({
  field1: new FormControl(...),
  field2: new FormControl(...),
  nestedGroup: new FormGroup({
    subField: new FormControl(...)
  })
});
```

### FormControl
Representa un campo individual del formulario.

```typescript
const nameControl = new FormControl('valor inicial', {
  nonNullable: true,           // Nunca será null
  validators: [Validators.required, Validators.minLength(3)]
});
```

### FormControl Options

```typescript
new FormControl<T>(initialValue, options);

// options puede incluir:
{
  nonNullable: boolean,      // Si es true, getValue() nunca retorna null
  validators: ValidatorFn[], // Array de validadores
  asyncValidators: AsyncValidatorFn[] // Validadores asíncronos
}
```

## 6.3 Validaciones

### Validadores Síncronos (Validators)

| Validador | Descripción | Ejemplo |
|-----------|-------------|---------|
| `required` | Campo obligatorio | `Validators.required` |
| `minLength(n)` | Mínimo n caracteres | `Validators.minLength(3)` |
| `maxLength(n)` | Máximo n caracteres | `Validators.maxLength(50)` |
| `pattern(regex)` | Debe coincidir con regex | `Validators.pattern(/^[A-Z]/)` |
| `email` | Debe ser email válido | `Validators.email` |
| `min(value)` | Valor mínimo | `Validators.min(0)` |
| `max(value)` | Valor máximo | `Validators.max(100)` |

### Ejemplo de Validaciones

```typescript
categoryForm = new FormGroup({
  name: new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,        // Obligatorio
      Validators.minLength(3),    // Mínimo 3 caracteres
      Validators.maxLength(50)    // Máximo 50 caracteres
    ]
  })
});
```

## 6.4 Acceso a Estado del Formulario

```typescript
// Obtener un control específico
const nameControl = this.categoryForm.get('name');

// Estado del control
nameControl?.value;      // Valor actual
nameControl?.valid;       // ¿Es válido?
nameControl?.invalid;     // ¿Es inválido?
nameControl?.touched;    // ¿El usuario lo ha tocado?
nameControl?.dirty;      // ¿El usuario lo ha modificado?
nameControl?.pristine;    // ¿Está en su valor original?
nameControl?.errors;     // { required: true, minlength: {...} }

// Estado del formulario completo
this.categoryForm.valid;      // ¿Todos los campos son válidos?
this.categoryForm.invalid;    // ¿Algún campo es inválido?
this.categoryForm.touched;   // ¿Algún campo ha sido tocado?
this.categoryForm.dirty;      // ¿Algún campo ha sido modificado?
this.categoryForm.value;     // { name: 'valor' }

// Obtener valores
this.categoryForm.value;           // Puede tener null
this.categoryForm.getRawValue();    // Nunca tiene null (respeta nonNullable)
```

## 6.5 Validador Personalizado

**Archivo:** `src/app/price-maximum.validator.ts` (ejemplo del proyecto)

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function priceMaximumValidator(maximum: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    if (value !== null && value > maximum) {
      return { priceMaximum: { maximum, actual: value } };
      // Retorna error si el valor excede el máximo
    }
    
    return null; // Sin error
  };
}
```

---

# 7. DEMOSTRACIÓN PRÁCTICA

## 7.1 Ejecutar el Proyecto

```bash
# Navegar al directorio del proyecto
cd 10_formularios

# Instalar dependencias (si no están)
npm install

# Iniciar servidor de desarrollo
npm start
```

## 7.2 Navegar a Categorías

1. Abrir navegador en `http://localhost:4200`
2. Hacer clic en "Categories" en el menú
3. Verificar que aparece la lista con 4 categorías iniciales

## 7.3 Probar la Funcionalidad

### Caso 1: Crear categoría válida
1. Hacer clic en "Nueva Categoría"
2. Verificar que aparece el formulario
3. Escribir "Deportes"
4. Hacer clic en "Crear Categoría"
5. **Esperado**: 
   - La categoría aparece en la lista
   - El formulario se oculta
   - El contador aumenta a 5

### Caso 2: Crear categoría vacía (error)
1. Hacer clic en "Nueva Categoría"
2. Dejar el campo vacío
3. Hacer clic en "Crear Categoría"
4. **Esperado**: 
   - Mensaje "El nombre es obligatorio"
   - Botón deshabilitado

### Caso 3: Crear categoría muy corta (error)
1. Hacer clic en "Nueva Categoría"
2. Escribir "AB"
3. **Esperado**: 
   - Mensaje "Mínimo 3 caracteres"
   - Botón deshabilitado

### Caso 4: Cancelar creación
1. Hacer clic en "Nueva Categoría"
2. Verificar que aparece el formulario
3. Hacer clic en "Cancelar"
4. **Esperado**: 
   - El formulario se oculta
   - La lista permanece sin cambios

---

# 8. DIAGRAMA DE FLUJO

## 8.1 Flujo Completo de la Aplicación

```
                        ┌─────────────────────────┐
                        │     INICIO             │
                        │   /categories          │
                        └───────────┬─────────────┘
                                    │
                                    ▼
                        ┌─────────────────────────┐
                        │   CategoryListComponent │
                        │   carga categorías      │
                        │   showCreateForm=false   │
                        └───────────┬─────────────┘
                                    │
                                    ▼
                        ┌─────────────────────────┐
                        │   Muestra lista         │
                        │   Botón: "Nueva         │
                        │   Categoría"            │
                        └───────────┬─────────────┘
                                    │
                                    ▼
                        ┌─────────────────────────┐
                        │ ¿Click en botón?        │
                        └───────────┬─────────────┘
                                    │
                        ┌───────────┴───────────┐
                        │                         │
                       SÍ                        NO
                        │                         │
                        ▼                         │
                    ┌─────────────────────────┐   │
                    │ toggleCreateForm()      │   │
                    │ showCreateForm=true     │   │
                    │ Muestra CategoryCreate  │   │
                    └───────────┬─────────────┘   │
                                │                 │
                                ▼                 │
                    ┌─────────────────────────┐   │
                    │ ¿Formulario válido?     │   │
                    │ (required + minLength)  │   │
                    └───────────┬─────────────┘   │
                                │                 │
                    ┌───────────┴───────────┐     │
                    │                         │    │
                   SÍ                        NO   │
                    │                         │    │
                    ▼                         │    │
            ┌───────────────┐                 │    │
            │ createCategory │                 │    │
            │ Genera ID      │                 │    │
            │ con Date.now()│                 │    │
            └───────┬───────┘                 │    │
                    │                         │    │
                    ▼                         │    │
        ┌─────────────────────────┐           │    │
        │ categoryCreated.emit()  │           │    │
        │ (envía categoría)        │           │    │
        └───────┬───────────────────┘           │    │
                │                               │    │
                ▼                               │    │
    ┌─────────────────────────┐                │    │
    │ onCategoryCreated()     │                │    │
    │ • push a categories[]    │                │    │
    │ • showCreateForm=false  │                │    │
    │ • reset formulario       │                │    │
    └───────┬───────────────────┘                │    │
            │                                    │    │
            ▼                                    │    │
    ┌─────────────────────────┐                  │    │
    │ Angular detecta cambio  │                  │    │
    │ y actualiza la vista    │                  │    │
    └───────┬───────────────────┘                  │    │
            │                                      │    │
            ▼                                      │    │
    ┌─────────────────────────┐                   │    │
    │ Muestra lista actualizada                  │   │
    │ + botón "Nueva Categoría"                   │   │
    └─────────────────────────────────────────────┘   │
                                                      │
                                                      ▼
                                            ┌─────────────────────────┐
                                            │        FIN              │
                                            └─────────────────────────┘
```

---

# 9. CÓDIGO COMPLETO

## 9.1 category.ts

```typescript
export interface Category {
  id: number;
  name: string;
}
```

## 9.2 category-create.component.ts

```typescript
import { Component, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../category';

@Component({
  selector: 'app-category-create',
  imports: [ReactiveFormsModule],
  templateUrl: './category-create.component.html',
  styleUrl: './category-create.component.css'
})
export class CategoryCreateComponent {
  categoryCreated = output<Category>();

  categoryForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)]
    })
  });

  createCategory(): void {
    if (this.categoryForm.valid) {
      const newCategory: Category = {
        id: Date.now(),
        name: this.categoryForm.getRawValue().name.trim()
      };
      this.categoryCreated.emit(newCategory);
      this.categoryForm.reset();
    }
  }
}
```

## 9.3 category-create.component.html

```html
<form [formGroup]="categoryForm" (ngSubmit)="createCategory()">
  <div class="form-group">
    <label for="categoryName">Nombre de la categoría:</label>
    <input 
      id="categoryName" 
      type="text" 
      formControlName="name"
      placeholder="Ej: Electrónica"
    />
    @if (categoryForm.get('name')?.invalid && categoryForm.get('name')?.touched) {
      <div class="error">
        @if (categoryForm.get('name')?.errors?.['required']) {
          <span>El nombre es obligatorio</span>
        }
        @if (categoryForm.get('name')?.errors?.['minlength']) {
          <span>Mínimo 3 caracteres</span>
        }
      </div>
    }
  </div>
  <button type="submit" [disabled]="categoryForm.invalid">Crear Categoría</button>
</form>
```

## 9.4 category-list.component.ts

```typescript
import { Component } from '@angular/core';
import { Category } from '../../category';
import { CategoryCreateComponent } from '../category-create/category-create.component';

@Component({
  selector: 'app-category-list',
  imports: [CategoryCreateComponent],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent {
  showCreateForm = false;

  categories: Category[] = [
    { id: 1, name: 'Electrónica' },
    { id: 2, name: 'Ropa' },
    { id: 3, name: 'Libros' },
    { id: 4, name: 'Hogar' }
  ];

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
  }

  onCategoryCreated(category: Category): void {
    this.categories.push(category);
    this.showCreateForm = false;
  }
}
```

## 9.5 category-list.component.html

```html
<div class="header">
  <h1>Categorías ({{categories.length}})</h1>
  <button (click)="toggleCreateForm()">
    {{ showCreateForm ? 'Cancelar' : 'Nueva Categoría' }}
  </button>
</div>

@if (showCreateForm) {
  <app-category-create (categoryCreated)="onCategoryCreated($event)" />
}

<ul class="category-list">
  @for (category of categories; track category.id) {
    <li>{{ category.name }}</li>
  } @empty {
    <p>No hay categorías disponibles.</p>
  }
</ul>
```

---

# 10. PREGUNTAS FRECUENTES

## P: ¿Por qué usar `output()` en lugar de `@Output()`?

**R:** `output()` es la API moderna de Angular 19+ que:
- Tiene mejor tipado en TypeScript
- Es compatible con el sistema de señales
- Es más eficiente en el árbol de componentes
- Es la dirección futura de Angular

## P: ¿Qué es `nonNullable: true`?

**R:** Indica que el `FormControl` nunca será `null`. Esto mejora el tipado porque:
- `getValue()` retorna `T` en vez de `T | null`
- El valor inicial nunca será `null`

## P: ¿Cuándo usar `getValue()` vs `getRawValue()`?

**R:**
- `getValue()`: Retorna el valor actual o `null` si el control está deshabilitado
- `getRawValue()`: Retorna el valor incluso si está deshabilitado, y respeta `nonNullable`

## P: ¿Por qué `track category.id` en el `@for`?

**R:** Angular usa `track` para optimizar el re-rendering:
- Si el array cambia, Angular sabe qué elementos son nuevos/modificados
- Sin `track`, Angular recrea toda la lista
- Con `track`, solo actualiza los elementos afectados

## P: ¿Cuál es la diferencia entre `touched` y `dirty`?

**R:**
- `touched`: El usuario ha enfocado y desenfocado el campo
- `dirty`: El usuario ha modificado el valor desde el inicial

## P: ¿Por qué `@if` en lugar de `*ngIf`?

**R:** `@if` es la nueva sintaxis de Angular 17+:
- Más legible y concisa
- Mejor rendimiento
- Funcionalmente equivalente a `*ngIf`

---

# RESUMEN FINAL

## Conceptos Clave

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONCEPTOS APRENDIDOS                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. COMPONENTES                                                │
│     • category-list (PADRE)                                     │
│     • category-create (HIJO)                                    │
│                                                                 │
│  2. COMUNICACIÓN                                               │
│     • output<Category>() → emitir eventos al padre             │
│                                                                 │
│  3. FORMULARIOS REACTIVOS                                      │
│     • FormGroup / FormControl                                   │
│     • Validators.required / minLength                           │
│     • [formGroup], formControlName                              │
│                                                                 │
│  4. ESTADO                                                      │
│     • showCreateForm (boolean para toggle)                      │
│     • categories[] (array de datos)                             │
│                                                                 │
│  5. ROUTING                                                     │
│     • /categories → CategoryListComponent                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Checklist de Implementación

- [x] Crear modelo Category
- [x] Crear CategoryListComponent (padre)
- [x] Crear CategoryCreateComponent (hijo)
- [x] Implementar formulario reactivo
- [x] Añadir validaciones
- [x] Implementar output() para comunicación
- [x] Crear toggle para mostrar/ocultar
- [x] Configurar rutas
- [x] Añadir navegación

---

**Fin del documento**
