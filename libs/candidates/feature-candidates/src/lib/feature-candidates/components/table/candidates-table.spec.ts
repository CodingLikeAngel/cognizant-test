import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UiTable, TableColumn } from '@my-fullstack-app/ui-components';
import { CommonModule } from '@angular/common';

describe('UiTable', () => {
  let component: UiTable;
  let fixture: ComponentFixture<UiTable>;

  const mockData = [
    { id: 1, name: 'Test Name 1', age: 30 },
    { id: 2, name: 'Test Name 2', age: 25 },
  ];
  const mockColumns: TableColumn[] = [
    { key: 'name', header: 'Nombre Completo' },
    { key: 'age', header: 'Edad' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiTable, CommonModule], 
    }).compileComponents();

    fixture = TestBed.createComponent(UiTable);
    component = fixture.componentInstance;
    
    component.data = mockData;
    component.columns = mockColumns;

    fixture.detectChanges(); 
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería renderizar los encabezados de columna correctos', () => {
    const headerCells = fixture.debugElement.queryAll(By.css('th'));
    expect(headerCells.length).toBe(mockColumns.length);
    expect(headerCells[0].nativeElement.textContent.trim()).toBe('Nombre Completo');
    expect(headerCells[1].nativeElement.textContent.trim()).toBe('Edad');
  });

  it(' debería renderizar el número de filas de datos correcto', () => {
    const dataRows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(dataRows.length).toBe(mockData.length);
  });

  it(' debería mostrar el contenido de datos correcto en las celdas', () => {
    const firstRowCells = fixture.debugElement.queryAll(By.css('tbody tr:first-child td'));
    expect(firstRowCells[0].nativeElement.textContent.trim()).toBe('Test Name 1');
    expect(firstRowCells[1].nativeElement.textContent.trim()).toBe('30');
  });
});
