import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, finalize, tap } from 'rxjs';
import { SnackBarUtil } from '../../shared/snackbar/snackbar.util';
import { CommonModule } from '@angular/common';
import { AttributeDefaultTypes } from '../attributes.types';
import { AttributesService } from '../../services/attributes.service';
import { AttributeType } from '../../shared/types/app.types';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-attribute-form',
  templateUrl: 'attributes.form.component.html',
  imports: [
    CommonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttributeFormComponent implements OnInit {
  private data = inject<AttributeDefaultTypes>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<AttributeFormComponent>);
  private attributesService = inject(AttributesService);
  private snackBar = inject(SnackBarUtil);

  busy = false;
  btnTxt = '';
  isUpdate = false;
  name = '';
  description = '';
  title = '';
  type: AttributeType = AttributeType.SYSTEM;
  attributeTypeOptions: { label: string; value: string }[] = Object.values(
    AttributeType
  ).map((t) => {
    return {
      label: t,
      value: t,
    };
  });

  ngOnInit() {
    this.btnTxt = this.data.btnText;
    this.isUpdate = this.data.isUpdate;
    this.title = this.data.title;
    this.name = this.data.name;
    this.description = this.data.description;
  }

  pageForm = new FormGroup({
    name: new FormControl(this.name, [Validators.required]),
    type: new FormControl(this.type, Validators.required),
    description: new FormControl(this.description, [Validators.required]),
  });

  onFormSubmit() {
    if (this.isUpdate) {
      this.update();
    } else {
      this.create();
    }
  }

  create() {
    this.busy = true;
    this.attributesService
      .create(this.name, this.description, this.type)
      .pipe(
        tap((res) => {
          this.snackBar.open(`Attribute created successfully`, 'success');
          this.dialogRef.close(res);
        }),
        catchError((error) => {
          const message = error.error.message[0] ?? '';
          this.snackBar.open(
            `An error occurred while creating attribute: ${error.statusText} \n ${message}`,
            'error'
          );
          throw error;
        }),
        finalize(() => {
          this.busy = false;
        })
      )
      .subscribe();
  }

  update() {
    this.busy = true;
    this.attributesService
      .update(this.data.id, this.name, this.description, this.type)
      .pipe(
        tap((res) => {
          this.snackBar.open(`Attribute updated successfully`, 'success');
          this.dialogRef.close(res);
        }),
        catchError((error) => {
          const message = error.error.message[0] ?? '';
          this.snackBar.open(
            `An error occurred while updating the attribute: ${error.statusText} \n ${message}`,
            'error'
          );
          throw error;
        }),
        finalize(() => {
          this.busy = false;
        })
      )
      .subscribe();
  }
}
