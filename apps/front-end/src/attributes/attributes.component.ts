import { Component, inject, OnInit } from "@angular/core";
import { TableComponent } from "../shared/table.component";
import { Columns } from "../shared/table.component.types";
import { MatTableDataSource } from "@angular/material/table";
import { Subject, takeUntil } from "rxjs";
import { AttributesService } from "../services/attributes.service";

@Component({
    imports: [TableComponent],
    selector: 'app-attributes',
    templateUrl: './attributes.component.html',
})

export class AttributesComponent implements OnInit {
    private attributesService = inject(AttributesService);
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
        this.attributesService.fetch()
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