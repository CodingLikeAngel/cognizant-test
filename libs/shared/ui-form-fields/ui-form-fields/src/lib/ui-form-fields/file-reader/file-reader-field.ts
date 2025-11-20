import { Component, forwardRef, inject, ElementRef, EventEmitter, Output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon'; 
import { MatButtonModule } from '@angular/material/button'; 

@Component({
  selector: 'lib-file-reader-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatButtonModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FileReaderField),
    multi: true,
  }],
  templateUrl: './file-reader-field.html',
  styleUrls: ['./file-reader-field.css'],
})
export class FileReaderField implements ControlValueAccessor {
  private el = inject(ElementRef);

  @Output() fileError = new EventEmitter<string>();

  isDragging = signal(false);
  selectedFile = signal<File | null>(null);
  isDisabled = signal(false);

  readonly hasFile = computed(() => !!this.selectedFile());
  readonly showError = signal(false);

  onChange: (value: File | null) => void = () => { /* empty */ };
  onTouched: () => void = () => { /* empty */ };

  writeValue(value: File | null): void {
    this.selectedFile.set(value);
  }

  registerOnChange(fn: (value: File | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  // Eventos drag & drop
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragEnter(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave() {
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
    this.onTouched();
    this.processFile(event.dataTransfer?.files || null);
  }

  processFile(fileList: FileList | null): void {
    if (fileList?.length) {
      const file = fileList[0];
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];

      if (!allowedTypes.includes(file.type)) {
        this.fileError.emit('Solo se permiten archivos Excel (.xls o .xlsx)');
        this.showError.set(true);
        return;
      }

      this.selectedFile.set(file);
      this.showError.set(false);
      this.onChange(file);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.processFile(input.files);
    this.onTouched();
  }

  openFileSelection(): void {
    this.el.nativeElement.querySelector('input[type="file"]').click();
  }

  clearFile(): void {
    this.selectedFile.set(null);
    this.onChange(null);
  }
}
