import { Component, inject, OnInit } from "@angular/core";
import { TableComponent } from "../shared/table.component";
import { Columns } from "../shared/table.component.types";
import { FeatureFlagsService } from "../services/feature_flag.service";
import { Subject, takeUntil } from "rxjs";
import { MatTableDataSource } from "@angular/material/table";

@Component({
    imports: [TableComponent],
    selector: 'app-feature-flag',
    templateUrl: './feature_flags.component.html',
})

export class FeatureFlagsComponent implements OnInit {
    private featureFlagsService = inject(FeatureFlagsService);
    private destroy$ = new Subject<void>();
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
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    this.dataSource.data = response;
                },
                error: (error) => {
                    console.log(error);
                },
                complete: () => {
                    this.busy = false;
                }
            });
    }
}