import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputField } from './input-field';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

describe('InputField', () => {
  let component: InputField<string>;
  let fixture: ComponentFixture<InputField<string>>;
  let inputEl: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputField, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
    }).compileComponents();

    fixture = TestBed.createComponent(InputField) as ComponentFixture<InputField<string>>;
    component = fixture.componentInstance as InputField<string>;
    fixture.detectChanges();

    inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should writeValue to input', () => {
    component.writeValue('test value');
    fixture.detectChanges();
    expect(inputEl.value).toBe('test value');
  });

  it('should call onChange when input changes', () => {
    const mockOnChange = jest.fn();
    component.registerOnChange(mockOnChange);

    inputEl.value = 'new value';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(mockOnChange).toHaveBeenCalledWith('new value');
  });

  it('should call onTouched on blur', () => {
    const mockOnTouched = jest.fn();
    component.registerOnTouched(mockOnTouched);

    inputEl.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(mockOnTouched).toHaveBeenCalled();
  });

  it('should disable and enable input', () => {
    component.setDisabledState(true);
    fixture.detectChanges();
    expect(inputEl.disabled).toBe(true);

    component.setDisabledState(false);
    fixture.detectChanges();
    expect(inputEl.disabled).toBe(false);
  });

  it('should integrate with FormGroup and reflect valueChanges', () => {
    const form = new FormGroup({ name: new FormControl('') });

    // Registrar onChange para reflejar cambios en el FormGroup
    component.registerOnChange((value: string | null) => form.controls['name'].setValue(value));
    component.registerOnTouched(() => { /* empty */ });

    // Cambiar valor desde el componente
    component.writeValue('Juan');
    fixture.detectChanges();
    expect(inputEl.value).toBe('Juan');

    // Cambiar valor desde el input y propagar al FormGroup
    inputEl.value = 'Pedro';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(form.controls['name'].value).toBe('Pedro');
  });

  it('should show type error when invalid input', () => {
    component.type = 'number';
    component.registerOnChange(() => { /* empty */ });
    inputEl.value = 'abc';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(By.css('mat-error'));
    expect(errorEl).toBeTruthy();
    expect(errorEl.nativeElement.textContent).toContain('Solo se permite un número');
  });
});
