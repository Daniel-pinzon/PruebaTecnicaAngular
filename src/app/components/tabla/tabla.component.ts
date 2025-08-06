import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { AddPostDialogComponent } from '../../../../add-post-dialog.component';
import { Post } from '../../../../post.model';
import { PostService } from '../../../../post.service';
import { ConfirmDialogComponent } from '../../../../confirm-dialog.component';

@Component({
  selector: 'app-tabla',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css'],
})
export class TablaComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'title', 'userId', 'actions'];
  dataSource = new MatTableDataSource<Post>();
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private snackBarConfig: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
  };

  constructor(public dialog: MatDialog, private postService: PostService, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadPosts(): void {
    this.isLoading = true;
    this.postService.getPosts()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: posts => {
          this.dataSource.data = posts;
        },
        error: (err) => {
          console.error('Error al cargar los posts', err);
          this.showSnackbar('Error al cargar los posts', 'error-snackbar');
        }
      });
  }

  openAddPostDialog(): void {
    const dialogRef = this.dialog.open(AddPostDialogComponent, {
      width: '450px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: Post | undefined) => {
      if (result) { // Omit<Post, 'id'>
        this.addPost(result as Omit<Post, 'id'>);
      }
    });
  }

  openEditPostDialog(post: Post): void {
    const dialogRef = this.dialog.open(AddPostDialogComponent, {
      width: '450px',
      disableClose: true,
      data: { ...post } // Pasamos una copia para no mutar el original
    });

    dialogRef.afterClosed().subscribe((result: Partial<Post> | undefined) => {
      if (result) {
        this.updatePost({ ...post, ...result });
      }
    });
  }

  addPost(newPost: Omit<Post, 'id'>): void {
    this.showSnackbar('Guardando post...', 'info-snackbar', 0);
    this.postService.addPost(newPost).subscribe({
      next: (post: Post) => {
        this._snackBar.dismiss();
        this.showSnackbar('¡Post guardado con éxito!', 'success-snackbar');
        const currentData = this.dataSource.data;
        this.dataSource.data = [post, ...currentData];
      },
      error: (err) => {
        this._snackBar.dismiss();
        this.showSnackbar('Error al guardar el post', 'error-snackbar');
        console.error('Error guardando post', err);
      }
    });
  }

  updatePost(post: Post): void {
    this.showSnackbar('Actualizando post...', 'info-snackbar', 0);
    this.postService.updatePost(post).subscribe({
      next: updatedPost => {
        this._snackBar.dismiss();
        const index = this.dataSource.data.findIndex(p => p.id === updatedPost.id);
        if (index > -1) {
          const data = this.dataSource.data;
          data[index] = updatedPost;
          this.dataSource.data = data;
          this.showSnackbar('¡Post actualizado con éxito!', 'success-snackbar');
        }
      },
      error: err => {
        this._snackBar.dismiss();
        this.showSnackbar('Error al actualizar el post', 'error-snackbar');
        console.error('Error actualizando post', err);
      }
    });
  }

  deletePost(postToDelete: Post): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Eliminación',
        message: `¿Estás seguro de que deseas eliminar el post "${postToDelete.title}"?`
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.postService.deletePost(postToDelete.id!).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter(p => p.id !== postToDelete.id);
            this.showSnackbar('¡Post eliminado con éxito!', 'success-snackbar');
          },
          error: err => {
            this.showSnackbar('Error al eliminar el post', 'error-snackbar');
            console.error('Error eliminando post', err);
          }
        });
      }
    });
  }

  private showSnackbar(message: string, panelClass: string, duration?: number) {
    this._snackBar.open(message, 'Cerrar', {
      ...this.snackBarConfig,
      duration: duration === undefined ? this.snackBarConfig.duration : duration,
      panelClass: [panelClass]
    });
  }
}
