import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { TableComponent } from '../shared/table/table.component';
import { Columns } from '../shared/table/table.component.types';
import { MatTableDataSource } from '@angular/material/table';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AttributesService } from '../services/attributes.service';
import { catchError, EMPTY, finalize, switchMap, tap } from 'rxjs';
import { SnackBarUtil } from '../shared/snackbar/snackbar.util';
import { MatDialog } from '@angular/material/dialog';
import { AttributeFormComponent } from './form/attributes.form.component';
import { AttributeDefaultValues } from './attributes.types';
import { VoidFormComponent } from '../shared/dialog/void-dialog/void.form.component';
import { VoidDto } from '../shared/dialog/void-dialog/types';

@Component({
  imports: [TableComponent],
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
})
export class AttributesComponent implements OnInit {
  private attributesService = inject(AttributesService);
  private snackBar = inject(SnackBarUtil);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);
  public busy = false;

  columns: Columns[] = [
    {
      name: 'Name',
      property: 'name',
    },
    {
      name: 'Description',
      property: 'description',
    },
    {
      name: 'Type',
      property: 'type',
    },
  ];

  dataSource = new MatTableDataSource<object>();

  ngOnInit() {
    this.fetchAttributes();
  }

  fetchAttributes() {
    this.busy = true;
    this.attributesService
      .fetch()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          this.dataSource.data = res;
        }),
        catchError((error) => {
          this.snackBar.open(
            `An error occurred while loading feature flags: ${error.statusText}`,
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

  addBtnClicked() {
    this.dialog
      .open(AttributeFormComponent, {
        data: AttributeDefaultValues,
        width: '800px',
        height: 'auto',
      })
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((result) => {
          if (result) {
            this.dataSource.data = [...this.dataSource.data, result];
          }
        })
      )
      .subscribe();
  }

  editBtnClicked(event: object) {
    this.dialog
      .open(AttributeFormComponent, {
        data: {
          ...event,
          isUpdate: true,
          title: `Edit attribute`,
          btnText: 'Update',
        },
        width: '800px',
        height: 'auto',
      })
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((result) => {
          if (result) {
            this.dataSource.data = this.dataSource.data.map((v: any) => {
              if (v.id === result.id) {
                v = result;
              }
              return v;
            });
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
            this.fetchAttributes();
          }
        })
      )
      .subscribe();
  }
  remove(id: number, voidDto: VoidDto) {
    return this.attributesService.delete(id, voidDto).pipe(
      tap(() => {
        this.snackBar.open(`Attribute flag deleted successfully`, 'success');
      }),
      catchError((error) => {
        this.snackBar.open(
          `An error occurred while deleting the attribute: ${error.statusText}`,
          'error'
        );
        throw error;
      })
    );
  }
}
