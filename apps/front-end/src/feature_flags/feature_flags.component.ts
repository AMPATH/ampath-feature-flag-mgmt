import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { TableComponent } from "../shared/table.component";
import { Columns } from "../shared/table.component.types";
import { FeatureFlagsService } from "../services/feature_flag.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatTableDataSource } from "@angular/material/table";
import { catchError, finalize } from "rxjs";
import { SnackBarUtil } from "../shared/snackbar/snackbar.util";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
    imports: [TableComponent],
    selector: 'app-feature-flag',
    templateUrl: './feature_flags.component.html',
})

export class FeatureFlagsComponent implements OnInit {
    private featureFlagsService = inject(FeatureFlagsService);
    private snackBar = inject(SnackBarUtil);
    private destroyRef = inject(DestroyRef);
    public busy = false;

    columns: Columns[] = [
        {
            name: "Name",
            property: "name"
        },
        {
            name: "Name",
            property: "description"
        },
        {
            name: "Created By",
            property: "createdBy"
        },
        {
            name: "Status",
            property: "status"
        },
        {
            name: "Retired",
            property: "retired"
        },
    ];

    dataSource = new MatTableDataSource<object>();

    ngOnInit() {
        this.busy = true;
        this.featureFlagsService.fetch()
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                catchError((error) => { throw error }),
                finalize(() => {
                    this.busy = false;
                }),
            )
            .subscribe({
                next: (response) => {
                    this.dataSource.data = response;
                },
                error: (error: HttpErrorResponse) => {
                    this.snackBar.open(`An error occurred while loading feature flags: ${error.statusText}`, "error")
                }
            });
    }
}