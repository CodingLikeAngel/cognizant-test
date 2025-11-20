import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileReaderField } from './file-reader-field';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { signal } from '@angular/core';

describe('FileReaderField (Signals)', () => {
  let component: FileReaderField;
  let fixture: ComponentFixture<FileReaderField>;
  let debugEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        FileReaderField,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FileReaderField);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should mark as dragging on dragover', () => {
    const event = { preventDefault: jest.fn() } as unknown as DragEvent;
    debugEl.triggerEventHandler('dragover', event);
    fixture.detectChanges();
    expect(component.isDragging()).toBe(true);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should remove dragging on dragleave', () => {
    component.isDragging.set(true);
    debugEl.triggerEventHandler('dragleave', {});
    fixture.detectChanges();
    expect(component.isDragging()).toBe(false);
  });

  it('should process dropped file', () => {
    const file = new File(['test content'], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const dataTransfer: any = { files: [file] };
    const mockOnChange = jest.fn();
    component.registerOnChange(mockOnChange);

    const dropEvent: any = { dataTransfer, preventDefault: jest.fn(), stopPropagation: jest.fn() };
    component.onDrop(dropEvent);
    fixture.detectChanges();

    expect(component.selectedFile()).toBe(file);
    expect(mockOnChange).toHaveBeenCalledWith(file);
    expect(component.isDragging()).toBe(false);
  });

  it('should clear file on delete', () => {
    const file = new File(['hello'], 'hello.xls', { type: 'application/vnd.ms-excel' });
    component.selectedFile.set(file);

    component.clearFile(); // Método que setea selectedFile a null
    fixture.detectChanges();
    expect(component.selectedFile()).toBeNull();
  });
});
