import { Component, ChangeDetectionStrategy, inject, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FeatureFlagsService } from "../../services/feature_flag.service";
import { catchError, finalize, tap } from "rxjs";
import { SnackBarUtil } from "../../shared/snackbar/snackbar.util";
import { CommonModule } from "@angular/common";
import { FeatureFlagDefaultTypes } from "../feature_flags.types";

@Component({
    selector: 'app-feature-flag-form',
    templateUrl: 'feature_flags.form.component.html',
    imports: [CommonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule, FormsModule, ReactiveFormsModule, MatProgressSpinnerModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureFlagFormComponent implements OnInit {
    private data = inject<FeatureFlagDefaultTypes>(MAT_DIALOG_DATA);
    private dialogRef = inject(MatDialogRef<FeatureFlagFormComponent>);
    private featureFlagsService = inject(FeatureFlagsService);
    private snackBar = inject(SnackBarUtil);

    busy = false;
    btnTxt = "";
    isUpdate = false;
    status = false;
    retired = false;
    name = "";
    description = "";
    title = "";

    ngOnInit() {
        this.btnTxt = this.data.btnText;
        this.isUpdate = this.data.isUpdate;
        this.title = this.data.title;
        this.status = this.data.status;
        this.name = this.data.name;
        this.description = this.data.description;
        this.retired = this.data.retired;
    }

    onStatusChange(event: MatSlideToggleChange) {
        this.status = event.checked;
    }

    onRetiredChange(event: MatSlideToggleChange) {
        this.retired = event.checked;
    }

    pageForm = new FormGroup({
        name: new FormControl(this.name, [Validators.required]),
        description: new FormControl(this.description, [Validators.required]),
        status: new FormControl(this.status),
        retired: new FormControl(this.retired),
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
        this.featureFlagsService.create(this.name, this.description, this.status)
            .pipe(
                tap((res) => {
                    this.snackBar.open(`Feature flag created successfully`, "success");
                    this.dialogRef.close(res);
                }),
                catchError((error) => {
                    const message = error.error.message[0] ?? "";
                    this.snackBar.open(`An error occurred while creating feature flag: ${error.statusText} \n ${message}`, "error");
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
        this.featureFlagsService.update(this.data.id, this.description, this.status, this.retired)
            .pipe(
                tap((res) => {
                    this.snackBar.open(`Feature flag updated successfully`, "success");
                    this.dialogRef.close(res);
                }),
                catchError((error) => {
                    const message = error.error.message[0] ?? "";
                    this.snackBar.open(`An error occurred while updating feature flag: ${error.statusText} \n ${message}`, "error");
                    throw error;
                }),
                finalize(() => {
                    this.busy = false;
                }),
            )
            .subscribe();
    }
}