import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { TableComponent } from "../shared/table/table.component";
import { Columns } from "../shared/table/table.component.types";
import { OperatorsService } from "../services/operators.service";
import { MatTableDataSource } from "@angular/material/table";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { SnackBarUtil } from "../shared/snackbar/snackbar.util";
import { catchError, finalize, tap } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { OperatorFormComponent } from "./form/operators.form.component";
import { OperatorDefaultValues } from "./operators.types";

@Component({
    imports: [TableComponent],
    selector: 'app-operators',
    templateUrl: './operators.component.html',
})

export class OperatorsComponent implements OnInit {
    private operatorsService = inject(OperatorsService);
    private dialog = inject(MatDialog);
    private snackBar = inject(SnackBarUtil);
    private destroyRef = inject(DestroyRef);
    public busy = false;

    columns: Columns[] = [
        {
            name: "Name",
            property: "name"
        },
        {
            name: "Description",
            property: "description"
        },
    ];

    dataSource = new MatTableDataSource<object>();

    ngOnInit() {
        this.fetchOperators();
    }

    fetchOperators() {
        this.busy = true;
        this.operatorsService.fetch()
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                tap((res) => {
                    this.dataSource.data = res;
                }),
                catchError((error) => {
                    this.snackBar.open(`An error occurred while loading operators: ${error.statusText}`, "error");
                    throw error;
                }),
                finalize(() => {
                    this.busy = false;
                }),
            )
            .subscribe();
    }

    addBtnClicked() {
        this.dialog.open(OperatorFormComponent, {
            data: OperatorDefaultValues,
            width: "800px",
            height: "auto"
        }).afterClosed().pipe(
            takeUntilDestroyed(this.destroyRef),
            tap(result => {
                if (result) {
                    this.dataSource.data = [...this.dataSource.data, result];
                }
            })
        ).subscribe();
    }

    editBtnClicked(event: object) {
        this.dialog.open(OperatorFormComponent, {
            data: {
                ...event,
                isUpdate: true,
                title: `Edit operator`,
                btnText: "Update"
            },
            width: "800px",
            height: "auto"
        }).afterClosed().pipe(
            takeUntilDestroyed(this.destroyRef),
            tap(result => {
                if (result) {
                    this.dataSource.data = [...this.dataSource.data, result];
                }
            })
        ).subscribe();
    }
}