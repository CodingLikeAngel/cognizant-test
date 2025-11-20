import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Candidate } from '@my-fullstack-app/candidates-api';

import { CandidatesService } from '@my-fullstack-app/data-access'; 
import { of } from 'rxjs';
import { CandidatesForm } from './candidates-form';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';



const mockCandidate: Candidate = {
  name: 'John',
  surname: 'Doe',
  seniority: 'senior',
  yearsOfExperience: 5,
  availability: true,
};


const mockCandidatesService = {
  uploadCandidateData: jest.fn(() => of(mockCandidate)), 
  
  addCandidate: jest.fn(),
};

describe('CandidatesForm', () => {
  let component: CandidatesForm;
  let fixture: ComponentFixture<CandidatesForm>;
  let candidatesService: CandidatesService; 
  
  let alertSpy: jest.SpyInstance; 

  beforeEach(async () => {
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(jest.fn());
    

    await TestBed.configureTestingModule({
      imports: [CandidatesForm, ReactiveFormsModule, CommonModule], 
      providers: [
        FormBuilder,
        { provide: CandidatesService, useValue: mockCandidatesService }, 
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidatesForm);
    component = fixture.componentInstance;
    
    candidatesService = TestBed.inject(CandidatesService); 
    
    jest.clearAllMocks();
    
    fixture.detectChanges(); 
  });
  
  afterEach(() => {
    alertSpy.mockRestore(); 
  });


  it('debería crearse y el formulario debería inicializarse con 3 controles', () => {
    expect(component).toBeTruthy();
    expect(component.candidateForm.contains('name')).toBe(true);
    expect(component.candidateForm.contains('resumeFile')).toBe(true);
  });


  it('el formulario debería ser inválido cuando está vacío', () => {
    expect(component.candidateForm.valid).toBeFalsy();
  });
  

  it('al enviar un formulario válido, debe llamar al servicio, actualizar el estado y resetear', () => {
    const data = {
      name: 'Angel',
      surname: 'Gomez',
     
      resumeFile: new File([''], 'cv.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    };
    
    component.candidateForm.setValue(data);
    expect(component.candidateForm.valid).toBeTruthy();

    
    component.onSubmit();

    
    expect(candidatesService.uploadCandidateData).toHaveBeenCalledWith(data);
    
    
    expect(candidatesService.addCandidate).toHaveBeenCalledWith(mockCandidate);


    expect(component.candidateForm.value.name).toBeNull();
  });

  
  it('no debería llamar al servicio si el formulario es inválido', () => {
   
    component.onSubmit();
    expect(candidatesService.uploadCandidateData).not.toHaveBeenCalled();
    
  });
});