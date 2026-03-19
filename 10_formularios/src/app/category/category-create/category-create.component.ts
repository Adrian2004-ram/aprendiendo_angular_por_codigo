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
