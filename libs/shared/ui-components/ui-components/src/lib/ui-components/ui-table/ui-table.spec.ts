import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiTable, TableColumn } from './ui-table';
import { By } from '@angular/platform-browser';

describe('UiTable', () => {
  let component: UiTable;
  let fixture: ComponentFixture<UiTable>;

  const columns: TableColumn[] = [
    { key: 'name', header: 'Nombre' },
    { key: 'role', header: 'Rol' },
  ];

  const data = [
    { name: 'Juan', role: 'Frontend' },
    { name: 'María', role: 'Backend' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiTable],
    }).compileComponents();

    fixture = TestBed.createComponent(UiTable);
    component = fixture.componentInstance;
    component.columns = columns;
    component.data = data;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render table headers', () => {
    const headers = fixture.debugElement.queryAll(By.css('th'));
    expect(headers.length).toBe(columns.length);
    expect(headers[0].nativeElement.textContent.trim()).toBe('Nombre');
    expect(headers[1].nativeElement.textContent.trim()).toBe('Rol');
  });

  it('should render table rows', () => {
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(data.length);

    const firstRowCells = rows[0].queryAll(By.css('td'));
    expect(firstRowCells[0].nativeElement.textContent.trim()).toBe('Juan');
    expect(firstRowCells[1].nativeElement.textContent.trim()).toBe('Frontend');
  });
});
