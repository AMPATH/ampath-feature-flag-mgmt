import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FeatureFlagsService } from '../services/feature_flag.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, finalize, switchMap, tap } from 'rxjs';
import { SnackBarUtil } from '../shared/snackbar/snackbar.util';
import { MatDialog } from '@angular/material/dialog';
import { AppFormDialogDefaultValues, RuleTypes } from './rules.types';
import { RulesService } from '../services/rules.service';
import { OperatorsService } from '../services/operators.service';
import { OperatorTypes } from '../operators/operators.types';
import { CommonModule } from '@angular/common';
import { AttributeTypes } from '../attributes/attributes.types';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { RulesFormComponent } from './form/rules.form.component';
import { AttributesService } from '../services/attributes.service';
import { ActivatedRoute } from '@angular/router';
import { TableComponent } from '../shared/table/table.component';
import { Columns } from '../shared/table/table.component.types';
import { MatTableDataSource } from '@angular/material/table';
import moment from 'moment';
import { VoidFormComponent } from '../shared/dialog/void-dialog/void.form.component';
import { VoidDto } from '../shared/dialog/void-dialog/types';

@Component({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    TableComponent,
  ],
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrl: 'rules.component.scss',
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
  featureName = '';
  featureDescription = '';
  operators: OperatorTypes[] = [];
  attributes: AttributeTypes[] = [];
  columns: Columns[] = [
    {
      name: 'No',
      property: 'no',
    },
    {
      name: 'Attribute',
      property: 'attribute',
    },
    {
      name: 'Operator',
      property: 'operator',
    },
    {
      name: 'Value',
      property: 'value',
    },
    {
      name: 'Created By',
      property: 'createdBy',
    },
    {
      name: 'Created Date',
      property: 'createdDate',
    },
  ];
  dataSource = new MatTableDataSource<any>([]);

  ngOnInit() {
    this.fetchRouteParams();
    this.fetchRules();
    this.fetchOperators();
    this.fetchAttributes();
  }

  fetchRouteParams() {
    this.route.params.pipe().forEach((param) => {
      this.featureFlagId = param['id'];
      this.featureName = param['name'];
      this.featureDescription = param['description'];
    });
  }

  generateDataSource(rules: RuleTypes[]) {
    const ds = rules.map((rule, index) => {
      return {
        no: index + 1,
        id: rule.id,
        attribute: rule.attribute.name,
        operator: rule.operator.name,
        value: rule.value,
        createdBy: rule.createdBy,
        createdDate: moment(rule.createdDate).format('YYYY-MM-DD'),
      };
    });
    this.dataSource = new MatTableDataSource(ds);
  }

  fetchRules() {
    this.busy = true;
    this.rulesService
      .fetchByFeatureFlagId(this.featureFlagId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          this.rules = res;
          this.generateDataSource(this.rules);
        }),
        catchError((error) => {
          this.snackBar.open(
            `An error occurred while loading operators: ${error.statusText}`,
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

  fetchOperators() {
    this.busy = true;
    this.operatorsService
      .fetch()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          this.operators = res;
        }),
        catchError((error) => {
          this.snackBar.open(
            `An error occurred while loading operators: ${error.statusText}`,
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

  fetchAttributes() {
    this.busy = true;
    this.attributesService
      .fetch()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          this.attributes = res;
        }),
        catchError((error) => {
          this.snackBar.open(
            `An error occurred while loading attributes: ${error.statusText}`,
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

  filterOperatorRules(operatorId: number) {
    const rules = this.rules.filter((v) => v.operator.id === operatorId);
    return rules;
  }

  add(operatorId: number): void {
    const filteredRules = this.filterOperatorRules(operatorId);
    const selectorAttributes = this.attributes.filter(
      (v) => !filteredRules.map((x) => x.attribute.id).includes(v.id)
    );

    this.dialog
      .open(RulesFormComponent, {
        data: {
          ...AppFormDialogDefaultValues,
          attributes: selectorAttributes,
          operatorId,
          operators: this.operators,
          featureFlagId: this.featureFlagId,
        },
        width: '800px',
        height: 'auto',
      })
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((result) => {
          if (result) {
            this.fetchRules();
          }
        })
      )
      .subscribe();
  }

  remove(ruleId: number, voidDto: VoidDto) {
    return this.rulesService.delete(ruleId, voidDto).pipe(
      tap(() => {
        this.snackBar.open(`Rule deleted successfully`, 'success');
      }),
      catchError((error) => {
        this.snackBar.open(
          `An error occurred while deleting the rule: ${error.statusText}`,
          'error'
        );
        throw error;
      })
    );
  }
  addBtnClicked() {
    this.dialog
      .open(RulesFormComponent, {
        data: {
          ...AppFormDialogDefaultValues,
          attributes: this.attributes,
          operators: this.operators,
          featureFlagId: this.featureFlagId,
        },
        width: '800px',
        height: 'auto',
      })
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((result) => {
          if (result) {
            this.fetchRules();
          }
        })
      )
      .subscribe();
  }
  editBtnClicked($event: any) {
    const rule: RuleTypes = this.rules[$event.no - 1] ?? null;
    this.dialog
      .open(RulesFormComponent, {
        data: {
          isUpdate: true,
          title: 'Update rule',
          btnText: 'Update',
          id: rule.id,
          attributeId: rule.attribute.id,
          operatorId: rule.operator.id,
          value: rule.value,
          attributes: this.attributes,
          operators: this.operators,
          featureFlagId: this.featureFlagId,
        },
        width: '800px',
        height: 'auto',
      })
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((result) => {
          if (result) {
            this.fetchRules();
          }
        })
      )
      .subscribe();
  }
  deleteBtnClicked($event: any) {
    this.dialog
      .open(VoidFormComponent, {
        data: {},
        width: '800px',
        height: 'auto',
      })
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((res: VoidDto) => {
          if (res) {
            return this.remove($event.id, res);
          } else {
            return EMPTY;
          }
        }),
        tap((result) => {
          if (result) {
            this.fetchRules();
          }
        })
      )
      .subscribe();
  }
}
