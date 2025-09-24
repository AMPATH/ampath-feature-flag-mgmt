import { Component } from "@angular/core";
import { TableComponent } from "../shared/table.component";
import { Columns } from "../shared/table.component.types";

@Component({ 
    imports: [TableComponent],
    selector: 'app-attributes',
    templateUrl: './attributes.component.html',
})

export class AttributesComponent {
    columns: Columns[] = [
        {
            name: "Name",
            property: "name"
        },
    ];

    dataset: Array<object> = [
        { name: "Facility"},
        { name: "Location"},
        { name: "Age"},
    ];
}