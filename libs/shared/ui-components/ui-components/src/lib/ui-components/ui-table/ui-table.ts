import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';


export interface TableColumn {
  key: string;     
  header: string;   
}

@Component({
  selector: 'lib-ui-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-table.html',
  styleUrls: ['./ui-table.css'],
})
export class UiTable {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
}
