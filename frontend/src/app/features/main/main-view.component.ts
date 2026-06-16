import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-main-view',
  standalone: true,
  imports: [MatToolbarModule, MatCardModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.scss',
})
export class MainViewComponent {
  readonly placeholderTrees = [
    { id: 'placeholder-1', name: 'Sample Family 1' },
    { id: 'placeholder-2', name: 'Sample Family 2' },
  ];
}
