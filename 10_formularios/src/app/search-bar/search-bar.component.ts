import { Component, DestroyRef, inject, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  imports: [ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {

  searchBar = new FormControl('', {nonNullable: true});

  termSearchBar = output<string>();

  //Necesario para takeUntilDestroyed en ngOnInit
  private destroyRef = inject(DestroyRef);

  ngOnInit() {

    this.searchBar.valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      //filter(term => term.length >=3),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe( search =>{
      console.log(`Search-Bar: ${search}`);
      this.termSearchBar.emit(search);
    });

  }

}
