import { Component } from "@angular/core";
import { TableComponent } from "../shared/table.component";
import { Columns } from "../shared/table.component.types";

@Component({ 
    imports: [TableComponent],
    selector: 'app-feature-flag',
    templateUrl: './feature_flags.component.html',
})

export class FeatureFlagsComponent {
    columns: Columns[] = [
        {
            name: "Name",
            property: "name"
        },
        {
            name: "Status",
            property: "status"
        }
    ];

    dataset: Array<object> = [
        { name: "Pre-appointment", status: "ON" },
        { name: "Prep-study", status: "OFF" }
    ];
}