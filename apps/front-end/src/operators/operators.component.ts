import { Component, inject, OnInit } from "@angular/core";
import { TableComponent } from "../shared/table.component";
import { Columns } from "../shared/table.component.types";
import { OperatorsService } from "../services/operators.service";
import { MatTableDataSource } from "@angular/material/table";
import { Subject, takeUntil } from "rxjs";

@Component({
    imports: [TableComponent],
    selector: 'app-operators',
    templateUrl: './operators.component.html',
})

export class OperatorsComponent implements OnInit {
    private operatorsService = inject(OperatorsService);
    private destroy$ = new Subject<void>();
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