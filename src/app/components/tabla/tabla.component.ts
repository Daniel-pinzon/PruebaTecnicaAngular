import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface Post {
  title: string;
  userId: number;
  body: string;
}

const ELEMENT_DATA: Post[] = [
  { userId: 1, title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit', body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto' },
  { userId: 1, title: 'qui est esse', body: 'est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla' },
  { userId: 1, title: 'ea molestias quasi exercitationem repellat qui ipsa sit aut', body: 'et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut' },
];

@Component({
  selector: 'app-tabla',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './tabla.component.html',
  styleUrl: './tabla.component.css',
  standalone: true,
})
export class TablaComponent {
  displayedColumns: string[] = ['title', 'userId', 'body'];
  dataSource = ELEMENT_DATA;
  showAddPostForm = false;
  postForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.postForm = this.fb.group({
      userId: ['', Validators.required],
      title: ['', Validators.required],
      body: ['', Validators.required],
    });
  }

  toggleAddPostForm(): void {
    this.showAddPostForm = !this.showAddPostForm;
  }

  addPost(): void {
    if (this.postForm.valid) {
      this.dataSource = [...this.dataSource, this.postForm.value];
      this.postForm.reset();
      this.showAddPostForm = false;
    }
  }
}
