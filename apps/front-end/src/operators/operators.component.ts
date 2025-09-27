import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { TableComponent } from "../shared/table.component";
import { Columns } from "../shared/table.component.types";
import { OperatorsService } from "../services/operators.service";
import { MatTableDataSource } from "@angular/material/table";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { SnackBarUtil } from "../shared/snackbar/snackbar.util";
import { catchError, finalize } from "rxjs";

@Component({
    imports: [TableComponent],
    selector: 'app-operators',
    templateUrl: './operators.component.html',
})

export class OperatorsComponent implements OnInit {
    private operatorsService = inject(OperatorsService);
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
        this.busy = true;
        this.operatorsService.fetch()
            .pipe(takeUntilDestroyed(this.destroyRef),
                catchError((error) => { throw error }),
                finalize(() => {
                    this.busy = false;
                }))
            .subscribe({
                next: (response) => {
                    this.dataSource.data = response;
                },
                error: (error) => {
                    this.snackBar.open(`An error occurred while loading operators: ${error.statusText}`, "error")
                }
            });
    }
}