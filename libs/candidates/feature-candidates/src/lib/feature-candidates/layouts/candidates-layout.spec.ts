import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidatesLayoutComponent } from './candidates-layout';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CANDIDATES_API_URL } from '@my-fullstack-app/data-access';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
describe('CandidatesLayoutComponent', () => {
  let component: CandidatesLayoutComponent;
  let fixture: ComponentFixture<CandidatesLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatesLayoutComponent, CommonModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CANDIDATES_API_URL, useValue: 'http://localhost:3000/api/candidates' },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidatesLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(' debería crearse', () => {
    expect(component).toBeTruthy();
  });
  
});