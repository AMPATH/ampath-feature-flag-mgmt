import { Component } from "@angular/core";
import { TableComponent } from "../shared/table.component";
import { Columns } from "../shared/table.component.types";

@Component({ 
    imports: [TableComponent],
    selector: 'app-operators',
    templateUrl: './operators.component.html',
})

export class OperatorsComponent {
    columns: Columns[] = [
        {
            name: "Name",
            property: "name"
        },
    ];

    dataset: Array<object> = [
        { name: "in"},
        { name: "not in"},
        { name: "equals"},
    ];
}