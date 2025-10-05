import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Columns } from './table.component.types';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
    selector: 'app-table',
    styleUrl: 'table.component.scss',
    templateUrl: 'table.component.html',
    imports: [MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, CommonModule, MatIconModule, MatButtonModule, MatProgressBarModule],
})
export class TableComponent implements OnInit, AfterViewInit {
    @Input() busy = false;
    @Input() columns: Columns[] = [];
    displayedColumns: string[] = [];
    @Input() dataSource = new MatTableDataSource<object>();
     @Input() showRulesButton = false;
    @Output() addBtnClicked = new EventEmitter();
    @Output() editBtnClicked = new EventEmitter();
    @Output() rulesBtnClicked = new EventEmitter();

    @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator();

    ngOnInit(): void {
        this.displayedColumns = this.columns.map(v => v.property);
        this.displayedColumns.push('action');
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

    onClickAddBtn() {
        this.addBtnClicked.emit();
    }

    onClickEditBtn(event: any) {
        this.editBtnClicked.emit(event);
    }

    onClickRulesBtn(event: any) {
        this.rulesBtnClicked.emit(event);
    }
}