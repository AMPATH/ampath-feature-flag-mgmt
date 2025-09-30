import { Component, ChangeDetectionStrategy, inject, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, finalize, tap } from "rxjs";
import { SnackBarUtil } from "../../shared/snackbar/snackbar.util";
import { CommonModule } from "@angular/common";
import { OperatorDefaultTypes } from "../operators.types";
import { OperatorsService } from "../../services/operators.service";

@Component({
    selector: 'app-operator-form',
    templateUrl: 'operators.form.component.html',
    imports: [CommonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatProgressSpinnerModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperatorFormComponent implements OnInit {
    private data = inject<OperatorDefaultTypes>(MAT_DIALOG_DATA);
    private dialogRef = inject(MatDialogRef<OperatorFormComponent>);
    private operatorsService = inject(OperatorsService);
    private snackBar = inject(SnackBarUtil);

    busy = false;
    btnTxt = "";
    isUpdate = false;
    name = "";
    description = "";
    title = "";

    ngOnInit() {
        this.btnTxt = this.data.btnText;
        this.isUpdate = this.data.isUpdate;
        this.title = this.data.title;
        this.name = this.data.name;
        this.description = this.data.description;
    }

    pageForm = new FormGroup({
        name: new FormControl(this.name, [Validators.required]),
        description: new FormControl(this.description, [Validators.required])
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
        this.operatorsService.create(this.name, this.description)
            .pipe(
                tap((res) => {
                    this.snackBar.open(`Operator created successfully`, "success");
                    this.dialogRef.close(res);
                }),
                catchError((error) => {
                    const message = error.error.message[0] ?? "";
                    this.snackBar.open(`An error occurred while creating operator: ${error.statusText} \n ${message}`, "error");
                    throw error;
                }),
                finalize(() => {
                    this.busy = false;
                }),
            )
            .subscribe();
    }

    update() {
        this.busy = true;
        this.operatorsService.update(this.data.id, this.name, this.description)
            .pipe(
                tap((res) => {
                    this.snackBar.open(`Operator updated successfully`, "success");
                    this.dialogRef.close(res);
                }),
                catchError((error) => {
                    const message = error.error.message[0] ?? "";
                    this.snackBar.open(`An error occurred while updating operator: ${error.statusText} \n ${message}`, "error");
                    throw error;
                }),
                finalize(() => {
                    this.busy = false;
                }),
            )
            .subscribe();
    }
}