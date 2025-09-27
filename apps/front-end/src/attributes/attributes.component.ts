import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { TableComponent } from "../shared/table.component";
import { Columns } from "../shared/table.component.types";
import { MatTableDataSource } from "@angular/material/table";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AttributesService } from "../services/attributes.service";
import { catchError, finalize } from "rxjs";
import { SnackBarUtil } from "../shared/snackbar/snackbar.util";

@Component({
    imports: [TableComponent],
    selector: 'app-attributes',
    templateUrl: './attributes.component.html',
})

export class AttributesComponent implements OnInit {
    private attributesService = inject(AttributesService);
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
        this.attributesService.fetch()
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
                    this.snackBar.open(`An error occurred while loading attributes: ${error.statusText}`, "error")
                }
            });
    }
}