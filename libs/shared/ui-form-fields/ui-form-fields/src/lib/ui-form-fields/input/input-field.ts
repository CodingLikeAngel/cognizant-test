import {
  Component,
  Input,
  forwardRef,
  ViewEncapsulation,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common'; 
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

const noop = () => { /* empty */ };

@Component({
  selector: 'lib-input-field',
  standalone: true, 
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputField),
      multi: true,
    },
  ],
  template: `
    <mat-form-field appearance="outline" class="w-full">
      <mat-label>{{ label }}</mat-label> 
      <input
        matInput
        [type]="type"
        [placeholder]="placeholder"
        [formControl]="control"
        [disabled]="isDisabled"
        (blur)="onTouched()"
        (input)="onInput($event)"
      />
       @if (showTypeError()) {
      <mat-error>{{ typeErrorMessage }}</mat-error> } 
    </mat-form-field>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class InputField<T extends string | number>
  implements ControlValueAccessor
{
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: 'text' | 'number' = 'text';

  control = new FormControl<T | null>(null);
  isDisabled = false;
  private showErrorSignal = signal(false);

  onChange: (value: T | null) => void = noop;
  onTouched: () => void = noop;

  get typeErrorMessage(): string {
    return this.type === 'text'
      ? 'Solo se permite texto'
      : 'Solo se permite un número';
  }

  showTypeError() {
    return computed(() => this.showErrorSignal());
  }

  writeValue(value: T | null): void {
    this.control.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    if (isDisabled) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (this.type === 'number') {
      const num = Number(value);
      if (value === '' || !isNaN(num)) {
        this.control.setErrors(null);
        this.control.setValue(num as T, { emitEvent: false });
        this.onChange(num as T);
        this.showErrorSignal.set(false);
      } else {
        this.control.setErrors({ typeMismatch: true });
        this.showErrorSignal.set(true);
      }
    } else {
      if (/^\d+$/.test(value)) {
        this.control.setErrors({ typeMismatch: true });
        this.onChange(null);
        this.showErrorSignal.set(true);
      } else {
        this.control.setErrors(null);
        this.control.setValue(value as T, { emitEvent: false });
        this.onChange(value as T);
        this.showErrorSignal.set(false);
      }
    }
  }
}
