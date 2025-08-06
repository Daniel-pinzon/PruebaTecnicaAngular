import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Post } from './post.model';

@Component({
    selector: 'app-add-post-dialog',
    templateUrl: './add-post-dialog.component.html',
    styleUrls: ['./add-post-dialog.component.css'],
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
    ],
})
export class AddPostDialogComponent {
    postForm: FormGroup;
    isEditMode: boolean;
    dialogTitle: string;

    constructor(
        public dialogRef: MatDialogRef<AddPostDialogComponent>,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: Post | null
    ) {
        this.isEditMode = !!data;
        this.dialogTitle = this.isEditMode ? 'Editar Post' : 'Agregar Nuevo Post';

        this.postForm = this.fb.group({
            userId: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
            title: ['', Validators.required],
            body: ['', Validators.required],
        });

        if (this.isEditMode && this.data) {
            this.postForm.patchValue(this.data);
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        if (this.postForm.valid) {
            this.dialogRef.close(this.postForm.value);
        }
    }
}