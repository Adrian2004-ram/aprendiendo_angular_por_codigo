# Search Bar - Comunicación Padre-Hijo en Angular

Este ejercicio implementa un buscador independiente (`search-bar`) que se comunica con un componente padre (`category-list`) para filtrar categorías en tiempo real.

## Arquitectura de la Solución

```
┌─────────────────────────────────────────────────────────────┐
│                    CategoryListComponent                    │
│  (Componente Padre - dueño de los datos)                   │
├─────────────────────────────────────────────────────────────┤
│  - categories: Category[] (datos originales)               │
│  - filteredCategories: Category[] (datos mostrados)        │
│  - onSearch(searchText): filtra el array                   │
│  - onCategoryCreated(category): añade nueva categoría      │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ (search) output event
                              │
┌─────────────────────────────────────────────────────────────┐
│                    SearchBarComponent                       │
│  (Componente Hijo - solo captura entrada)                  │
├─────────────────────────────────────────────────────────────┤
│  - searchControl: FormControl (input reactivo)              │
│  - valueChanges: observable que detecta cambios            │
│  - output() search: emite el texto al padre                 │
└─────────────────────────────────────────────────────────────┘
```

## Mecanismos Implementados

### 1. Reactive Forms (FormControl)

**¿Qué es?**
Los Reactive Forms son una forma de manejar formularios en Angular basada en programación reactiva. A diferencia de los formularios basados en plantillas (Template-driven), los Reactive Forms se crean y gestionan completamente en el componente.

**¿Por qué usarlo?**
- Mayor control sobre la validación
- Acceso programático al estado del formulario
- Facilita el uso con observables
- Código más testeable

**En este ejercicio:**
```typescript
searchControl = new FormControl('');
```

El `FormControl` es la unidad básica de un formulario reactivo. Representa un único campo de formulario y proporciona:
- Estado del control (dirty, touched, valid, invalid)
- Valor actual del campo
- Observable para detectar cambios

### 2. valueChanges Observable

**¿Qué es?**
`valueChanges` es un observable que emite el valor del control cada vez que cambia. Es parte del `AbstractControl` del que hereda `FormControl`.

**¿Por qué usarlo?**
Permite reaccionar a los cambios del input en tiempo real sin necesidad de eventos como `(change)` o `(input)`.

**En este ejercicio:**
```typescript
this.searchControl.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged()
).subscribe((value) => {
  this.search.emit(value || '');
});
```

### 3. Operadores RxJS

#### debounceTime(300)
Espera 300ms después del último cambio antes de emitir el valor. Evita que se realice una búsqueda por cada keystroke, reduciendo operaciones innecesarias.

#### distinctUntilChanged()
Solo emite el valor si es diferente al anterior. Evita búsquedas repetidas cuando el usuario escribe y borra caracteres.

### 4. output() y signal outputs (Angular 17+)

**¿Qué es?**
`output()` es la nueva forma de Angular 17+ para crear outputs (comunicación hijo → padre). Sustituye al tradicional `@Output()` con `EventEmitter`.

**Sintaxis tradicional (Angular < 17):**
```typescript
@Output() search = new EventEmitter<string>();
```

**Nueva sintaxis (Angular 17+):**
```typescript
search = output<string>();
```

**¿Por qué usar output()?**
- Síntaxis más简洁 (cleaner)
- Compatible con signals
- Menos código boilerplate

### 5. Comunicación Padre-Hijo

**Flujo de datos:**
1. Usuario escribe en el input del `search-bar`
2. `valueChanges` detecta el cambio
3. Se aplica debounce (300ms) y distinctUntilChanged
4. El componente hijo emite: `this.search.emit(value)`
5. El componente padre recibe: `<app-search-bar (search)="onSearch($event)">`
6. El padre filtra el array y actualiza `filteredCategories`
7. La vista se actualiza automáticamente

### 6. Separación de Responsabilidades

| Componente | Responsabilidad |
|------------|------------------|
| **search-bar** | Capturar entrada del usuario, crear observable, emitir eventos |
| **category-list** | Mantener datos originales, filtrar array, gestionar estado de la vista |

Esta separación permite que:
- El search-bar sea reutilizable en otros contextos
- La lógica de negocio (filtrado) stay en el padre
- Los componentes sean más testeables independientemente

## Código Implementado

### SearchBarComponent

```typescript
export class SearchBarComponent implements OnInit {
  search = output<string>();  // Output para comunicar al padre
  searchControl = new FormControl('');  // FormControl reactivo

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),      // Esperar 300ms
      distinctUntilChanged()  // Solo si cambia
    ).subscribe((value) => {
      this.search.emit(value || '');  // Emitir al padre
    });
  }
}
```

### CategoryListComponent

```typescript
export class CategoryListComponent {
  categories: Category[] = [...];  // Datos originales
  filteredCategories: Category[] = [...this.categories];  // Datos mostrados

  onSearch(searchText: string): void {
    if (!searchText.trim()) {
      this.filteredCategories = [...this.categories];
    } else {
      const lower = searchText.toLowerCase();
      this.filteredCategories = this.categories.filter(c => 
        c.name.toLowerCase().includes(lower)
      );
    }
  }
}
```

## Requisitos Cumplidos

- ✅ Componente independiente `search-bar`
- ✅ Incrustado dentro de `category-list`
- ✅ Reactive Forms con `FormControl`
- ✅ `valueChanges` para detectar cambios
- ✅ `output()` para comunicación hijo→padre
- ✅ Filtrado en el componente padre
- ✅ Búsqueda case-insensitive
- ✅ Campo vacío muestra todas las categorías
- ✅ Sin coincidencias muestra mensaje apropiado

## Ejemplo de Uso

1. El usuario ve el listado de categorías (todas inicialmente)
2. Escribe "ele" en el buscador
3. Después de 300ms (debounce), se emite "ele" al padre
4. El padre filtra: categorías que contengan "ele" (Electrónica)
5. La vista muestra solo "Electrónica"
6. Si escribe "xyz", muestra "No se han encontrado categorías"
7. Si borra el campo, muestra todas las categorías nuevamente