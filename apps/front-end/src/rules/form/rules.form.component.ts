import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  DestroyRef,
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
import { catchError, finalize, map, tap } from 'rxjs';
import { SnackBarUtil } from '../../shared/snackbar/snackbar.util';
import { CommonModule } from '@angular/common';
import { RulesService } from '../../services/rules.service';
import { MatSelectModule } from '@angular/material/select';
import { AttributeTypes } from '../../attributes/attributes.types';
import { OperatorTypes } from '../../operators/operators.types';
import { CreateRuleDto, UpdateRuleDto } from '../rules.types';
import { LocationService } from '../../services/location.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AttributeType, Location } from '../../shared/types/app.types';

@Component({
  selector: 'app-rules-form',
  templateUrl: 'rules.form.component.html',
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
    MatSelectModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RulesFormComponent implements OnInit {
  private data = inject<any>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<RulesFormComponent>);
  private rulesService = inject(RulesService);
  private snackBar = inject(SnackBarUtil);
  private locationService = inject(LocationService);
  private destroyRef = inject(DestroyRef);

  attributes: AttributeTypes[] = [];
  busy = false;
  btnTxt = '';
  isUpdate = false;
  operators: OperatorTypes[] = [];
  value = '';
  title = '';
  amrsLocations: Location[] = [];
  amrsLocationOptions: { value: string; label: string }[] = [];

  filteredLocationOptions: { value: string; label: string }[] = [];
  selectedAttribute: AttributeTypes | undefined;
  attributeType = AttributeType;

  pageForm = new FormGroup({
    featureFlagId: new FormControl<number | null>(null, [Validators.required]),
    attributeId: new FormControl<number | null>(null, [Validators.required]),
    operatorId: new FormControl<number | null>(null, [Validators.required]),
    value: new FormControl<string[] | string | null>(null, [
      Validators.required,
    ]),
  });

  ngOnInit() {
    this.attributes = this.data.attributes;
    this.btnTxt = this.data.btnText;
    this.isUpdate = this.data.isUpdate;
    this.title = this.data.title;
    this.operators = this.data.operators;
    this.setSelectedAttribute(this.data.attributeId);
    this.setDefaultFormValues();
    this.getAmrsLocations();
    this.listenToAttributeChanges();
  }

  setDefaultFormValues() {
    let valueData = null;
    if (this.selectedAttribute?.type === this.attributeType.LOCATION) {
      valueData = this.data.value.split(',');
    } else {
      valueData = this.data.value;
    }
    this.pageForm.patchValue({
      featureFlagId: Number(this.data.featureFlagId),
      attributeId: this.data.attributeId,
      operatorId: this.data.operatorId,
      value: valueData,
    });
  }

  onFormSubmit() {
    const payload = this.generateCreatePayload();
    if (!this.isValidCreatePayload(payload)) return;
    if (this.isUpdate) {
      this.update(payload);
    } else {
      this.create(payload);
    }
  }

  isValidCreatePayload(createRuleDto: CreateRuleDto): boolean {
    if (!createRuleDto.attributeId) {
      this.handleError('Please select an attribute!');
      return false;
    }
    if (!createRuleDto.featureFlagId) {
      this.handleError('Feature Flag not selected!');
      return false;
    }
    if (!createRuleDto.operatorId) {
      this.handleError('Please select an operator!');
      return false;
    }
    if (!createRuleDto.value) {
      this.handleError('Please enter a value!');
      return false;
    }
    return true;
  }

  generateCreatePayload(): CreateRuleDto {
    const { featureFlagId, attributeId, operatorId, value } =
      this.pageForm.value;
    let ruleValue = null;
    if (this.selectedAttribute?.type === this.attributeType.LOCATION) {
      ruleValue = (value as unknown as string[]).join(',');
    } else {
      ruleValue = value;
    }
    return {
      featureFlagId: featureFlagId ?? 0,
      operatorId: operatorId ?? 0,
      value: (ruleValue as any) ?? 0,
      attributeId: attributeId ?? 0,
    };
  }

  create(createRuleDto: CreateRuleDto) {
    this.busy = true;
    this.rulesService
      .create(createRuleDto)
      .pipe(
        tap((res) => {
          this.snackBar.open(`Rule created successfully`, 'success');
          this.dialogRef.close(res);
        }),
        catchError((error) => {
          const message = error.error.message[0] ?? '';
          this.handleError(
            `An error occurred while creating a rule: ${error.statusText} \n ${message}`
          );
          throw error;
        }),
        finalize(() => {
          this.busy = false;
        })
      )
      .subscribe();
  }
  handleError(msg: string) {
    this.snackBar.open(msg, 'error');
  }

  update(updateRuleDto: UpdateRuleDto) {
    this.busy = true;
    this.rulesService
      .update(this.data.id, updateRuleDto)
      .pipe(
        tap((res) => {
          this.snackBar.open(`Rule updated successfully`, 'success');
          this.dialogRef.close(res);
        }),
        catchError((error) => {
          const message = error.error.message[0] ?? '';
          this.handleError(
            `An error occurred while updating the rule: ${error.statusText} \n ${message}`
          );
          throw error;
        }),
        finalize(() => {
          this.busy = false;
        })
      )
      .subscribe();
  }

  getAmrsLocations() {
    this.busy = true;
    this.locationService
      .fetch()
      .pipe(
        tap((l) => {
          this.amrsLocations = l.results;
        }),
        map((res) => {
          return res.results.map((l) => {
            return {
              label: l.display,
              value: l.display,
            };
          });
        }),
        tap((res) => {
          this.amrsLocationOptions = res;
        }),
        finalize(() => {
          this.busy = false;
        })
      )
      .subscribe();
  }
  listenToAttributeChanges() {
    this.pageForm
      .get('attributeId')
      ?.valueChanges.pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((attributeId) => {
          this.resetValue();
          if (attributeId) {
            this.setSelectedAttribute(attributeId);
          }
        })
      )
      .subscribe();
  }
  setSelectedAttribute(attributeId: number) {
    this.selectedAttribute = this.attributes.find((at) => {
      return at.id === attributeId;
    });
  }
  resetValue() {
    this.pageForm.patchValue({
      value: null,
    });
  }
}
