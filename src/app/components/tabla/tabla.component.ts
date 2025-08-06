import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AddPostDialogComponent } from '../../../../add-post-dialog.component';
import { Post } from '../../../../post.model';
import { PostService } from '../../../../post.service';

@Component({
  selector: 'app-tabla',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css'],
  standalone: true,
})
export class TablaComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'title', 'userId', 'body'];
  dataSource = new MatTableDataSource<Post>();
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(public dialog: MatDialog, private postService: PostService) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadPosts(): void {
    this.isLoading = true;
    this.postService.getPosts().subscribe(posts => {
      this.dataSource.data = posts;
      this.isLoading = false;
    });
  }

  openAddPostDialog(): void {
    const dialogRef = this.dialog.open(AddPostDialogComponent, {
      width: '450px',
      disableClose: true, // Evita que el diálogo se cierre al hacer clic fuera
    });

    dialogRef.afterClosed().subscribe((result: Post | undefined) => {
      // El 'result' es el valor que pasamos al cerrar el diálogo
      if (result) {
        this.addPost(result);
      }
    });
  }

  addPost(newPost: Post): void {
    this.postService.addPost(newPost).subscribe((post: Post) => {
      console.log('Post agregado en el servidor:', post);
      const currentData = this.dataSource.data;
      this.dataSource.data = [post, ...currentData];
    });
  }
}
