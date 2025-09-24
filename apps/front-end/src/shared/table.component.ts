import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Columns } from './table.component.types';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-table',
    styleUrl: 'table.component.scss',
    templateUrl: 'table.component.html',
    imports: [MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, CommonModule, MatIconModule, MatButtonModule],
})
export class TableComponent implements OnInit, AfterViewInit {
    @Input() columns: Columns[] = [];
    @Input() dataset: Array<object> = [];
    displayedColumns: string[] = [];
    dataSource = new MatTableDataSource<object>();

    @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator();

    ngOnInit(): void {
        this.displayedColumns = this.columns.map(v => v.property);
        this.displayedColumns.push('action'); 
        this.dataSource = new MatTableDataSource(this.dataset);
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
}