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
import { RulesService } from "../../services/rules.service";
import { MatSelectModule } from '@angular/material/select';
import { AttributeTypes } from "../../attributes/attributes.types";

@Component({
    selector: 'app-rules-form',
    templateUrl: 'rules.form.component.html',
    imports: [CommonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatSelectModule, MatProgressSpinnerModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RulesFormComponent implements OnInit {
    private data = inject<any>(MAT_DIALOG_DATA);
    private dialogRef = inject(MatDialogRef<RulesFormComponent>);
    private rulesService = inject(RulesService);
    private snackBar = inject(SnackBarUtil);

    attributes: AttributeTypes[] = [];
    busy = false;
    btnTxt = "";
    isUpdate = false;
    featureFlagId = 0;
    attributeIds: Array<number> = [];
    operatorId = 0;
    value = "";
    title = "";

    ngOnInit() {
        this.attributes = this.data.attributes;
        this.btnTxt = this.data.btnText;
        this.isUpdate = this.data.isUpdate;
        this.title = this.data.title;
        this.featureFlagId = Number(this.data.featureFlagId);
        this.attributeIds = this.data.attributeId;
        this.operatorId = Number(this.data.operatorId);
        this.value = this.data.value
    }

    pageForm = new FormGroup({
        featureFlagId: new FormControl(this.featureFlagId, [Validators.required]),
        attributeIds: new FormControl(this.attributeIds, [Validators.required]),
        operatorId: new FormControl(this.operatorId, [Validators.required]),
        value: new FormControl(this.value, [Validators.required])
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
        this.attributeIds.forEach(attributeId => {
            this.rulesService.create(this.featureFlagId, attributeId, this.operatorId, this.value)
                .pipe(
                    tap((res) => {
                        this.snackBar.open(`Rule created successfully`, "success");
                        this.dialogRef.close(res);
                    }),
                    catchError((error) => {
                        const message = error.error.message[0] ?? "";
                        this.snackBar.open(`An error occurred while creating a rule: ${error.statusText} \n ${message}`, "error");
                        throw error;
                    }),
                    finalize(() => {
                        this.busy = false;
                    }),
                )
                .subscribe();
        });
    }

    update() {
        this.busy = true;
        this.attributeIds.forEach(attributeId => {
            this.rulesService.update(this.data.id, this.featureFlagId, attributeId, this.operatorId, this.value)
                .pipe(
                    tap((res) => {
                        this.snackBar.open(`Rule updated successfully`, "success");
                        this.dialogRef.close(res);
                    }),
                    catchError((error) => {
                        const message = error.error.message[0] ?? "";
                        this.snackBar.open(`An error occurred while updating the rule: ${error.statusText} \n ${message}`, "error");
                        throw error;
                    }),
                    finalize(() => {
                        this.busy = false;
                    }),
                )
                .subscribe();
        });
    }
}