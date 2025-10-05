import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { FeatureFlagsService } from "../services/feature_flag.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { catchError, finalize, tap } from "rxjs";
import { SnackBarUtil } from "../shared/snackbar/snackbar.util";
import { MatDialog } from "@angular/material/dialog";
import { AppFormDialogDefaultValues, RuleTypes } from "./rules.types";
import { RulesService } from "../services/rules.service";
import { OperatorsService } from "../services/operators.service";
import { OperatorTypes } from "../operators/operators.types";
import { CommonModule } from "@angular/common";
import { AttributeTypes } from "../attributes/attributes.types";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { RulesFormComponent } from "./form/rules.form.component";
import { AttributesService } from "../services/attributes.service";
import { ActivatedRoute } from "@angular/router";

@Component({
    imports: [CommonModule, MatFormFieldModule, MatChipsModule, MatIconModule],
    selector: 'app-rules',
    templateUrl: './rules.component.html',
    styleUrl: 'rules.component.scss'
})

export class RulesComponent implements OnInit {
    readonly addOnBlur = true;
    readonly separatorKeysCodes = [ENTER, COMMA] as const;
    private rulesService = inject(RulesService);
    private featureFlagsService = inject(FeatureFlagsService);
    private operatorsService = inject(OperatorsService);
    private attributesService = inject(AttributesService);
    private snackBar = inject(SnackBarUtil);
    private destroyRef = inject(DestroyRef);
    private dialog = inject(MatDialog);
    private route = inject(ActivatedRoute);
    busy = false;

    rules: RuleTypes[] = [];
    featureFlagId = 0;
    featureName = "";
    featureDescription = "";
    operators: OperatorTypes[] = [];
    attributes: AttributeTypes[] = [];

    ngOnInit() {
        this.fetchRouteParams();
        this.fetchRules();
        this.fetchOperators();
        this.fetchAttributes();
    }

    fetchRouteParams() {
        this.route.params
            .pipe()
            .forEach(param => {
                this.featureFlagId = param["id"];
                this.featureName = param["name"];
                this.featureDescription = param["description"];
            });
    }

    fetchRules() {
        this.busy = true;
        this.rulesService.fetch()
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                tap((res) => {
                    this.rules = res;
                }),
                catchError((error) => {
                    this.snackBar.open(`An error occurred while loading operators: ${error.statusText}`, "error");
                    throw error;
                }),
                finalize(() => {
                    this.busy = false;
                }),
            ).subscribe();
    }

    fetchOperators() {
        this.busy = true;
        this.operatorsService.fetch()
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                tap((res) => {
                    this.operators = res;
                }),
                catchError((error) => {
                    this.snackBar.open(`An error occurred while loading operators: ${error.statusText}`, "error");
                    throw error;
                }),
                finalize(() => {
                    this.busy = false;
                }),
            ).subscribe();
    }

    fetchAttributes() {
        this.busy = true;
        this.attributesService.fetch()
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                tap((res) => {
                    this.attributes = res;
                }),
                catchError((error) => {
                    this.snackBar.open(`An error occurred while loading attributes: ${error.statusText}`, "error");
                    throw error;
                }),
                finalize(() => {
                    this.busy = false;
                }),
            ).subscribe();
    }

    filterOperatorRules(operatorId: number) {
        const rules = this.rules.filter(v => v.operator.id === operatorId);
        return rules;
    }

    add(operatorId: number): void {
        const filteredRules = this.filterOperatorRules(operatorId);
        const selectorAttributes = this.attributes.filter(v => !filteredRules.map(x => x.attribute.id).includes(v.id));

        this.dialog.open(RulesFormComponent, {
            data: { ...AppFormDialogDefaultValues, attributes: selectorAttributes, operatorId, featureFlagId: this.featureFlagId },
            width: "800px",
            height: "auto"
        }).afterClosed().pipe(
            takeUntilDestroyed(this.destroyRef),
            tap(result => {
                if (result) {
                    this.fetchRules();
                }
            })
        ).subscribe();
    }

    remove(rule: RuleTypes): void {
        this.rulesService.delete(rule.id)
            .pipe(
                tap(() => {
                    this.snackBar.open(`Rule deleted successfully`, "success");
                }),
                catchError((error) => {
                    this.snackBar.open(`An error occurred while deleting the rule: ${error.statusText}`, "error");
                    throw error;
                }),
                finalize(() => {
                    this.fetchRules();
                }),
            )
            .subscribe();
    }
}