import { Component, output } from '@angular/core';
import { FormControl, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-category-create',
  imports: [ReactiveFormsModule],
  templateUrl: './category-create.component.html',
  styleUrl: './category-create.component.css',
})
export class CategoryCreateComponent {

  categoryCreated = output<string>();

  categoryForm = new FormGroup({
    name: new FormControl('', { nonNullable: true,
      validators: Validators.required
     })
  });

  createCategory() {
    console.log(this.categoryForm.value);
    this.categoryCreated.emit(this.categoryForm.value.name!);  
  }

}
