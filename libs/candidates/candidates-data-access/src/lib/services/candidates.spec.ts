import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { CandidatesService } from './candidates'; 
import { Candidate, CandidateFormData } from '@my-fullstack-app/candidates-api';
import { CANDIDATES_API_URL } from './api-url';
import { provideHttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';


const localStorageMock = (function () {
  let store: { [key: string]: string } = {};
  return {

    getItem: (key: string) => store['candidates'] || null, 
    setItem: (key: string, value: string) => {
      store['candidates'] = value.toString();
    },
    removeItem: (key: string) => {
      delete store['candidates'];
    },
    clear: () => {
      store = {};
    }
  };
})();


Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('CandidatesService', () => {
  let service: CandidatesService;
  let httpMock: HttpTestingController;
  const API_URL = 'http://localhost:3000/api/candidates';

  // Datos mock
  const mockCandidateA: Candidate = { name: 'Ana', surname: 'García', seniority: 'junior', yearsOfExperience: 0, availability: false };
  const mockCandidateB: Candidate = { name: 'Carlos', surname: 'López', seniority: 'mid', yearsOfExperience: 5, availability: true };
  const mockCandidateC: Candidate = { name: 'Beto', surname: 'Pérez', seniority: 'senior', yearsOfExperience: 2, availability: false };

  beforeEach(() => {
    localStorageMock.clear(); 

    TestBed.configureTestingModule({
      providers: [
        CandidatesService,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: CANDIDATES_API_URL,
          useValue: API_URL
        }
      ],
    });

    service = TestBed.inject(CandidatesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorageMock.clear(); 
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load candidates from localStorage on creation', fakeAsync(() => {
   
    localStorageMock.setItem('candidates', JSON.stringify([mockCandidateA]));
    service = TestBed.inject(CandidatesService); 

    let list: Candidate[] = [];
    service.candidates$.pipe(first()).subscribe((l: Candidate[]) => list = l);
    
    tick();

    expect(list.length).toBe(1);
    expect(list[0].name).toBe('Ana');
  }));

  // --- Pruebas de HTTP ---

  it('should send FormData and return created Candidate', () => {
    const mockFormData: CandidateFormData = {
      name: 'Juan',
      surname: 'Pérez',
      resumeFile: new File(['test'], 'cv.xlsx'),
    };
    const mockResponse: Candidate = {
      name: 'Juan',
      surname: 'Pérez',
      seniority: 'junior',
      yearsOfExperience: 0,
      availability: false
    };

    service.uploadCandidateData(mockFormData).subscribe((result: Candidate) => {
      expect(result).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${API_URL}/upload`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBe(true); 

    req.flush(mockResponse);
  });

  // --- Pruebas de Gestión de Estado (RxJS y Persistencia) ---

  it('should update candidates state and save to localStorage when addCandidate is called', fakeAsync(() => {
    let list: Candidate[] = [];
    service.candidates$.subscribe((l: Candidate[]) => list = l); 

  
    service.addCandidate(mockCandidateA);
    tick(); 

    expect(list.length).toBe(1);
    expect(list[0]).toEqual(mockCandidateA);
    expect(localStorageMock.getItem('candidates')).toBe(JSON.stringify([mockCandidateA]));


    service.addCandidate(mockCandidateB);
    tick(); 

    expect(list.length).toBe(2);
    expect(list[1]).toEqual(mockCandidateB);
  }));

  it('should clear candidates from state and localStorage', fakeAsync(() => {
    service.addCandidate(mockCandidateA);
    tick();

    service.clearCandidates();

    service.candidates$.pipe(first()).subscribe((list: Candidate[]) => {
      expect(list.length).toBe(0);
    });

    expect(localStorageMock.getItem('candidates')).toBeNull();
  }));

  // --- Pruebas de Filtrado y Ordenación ---

  it('should filter candidates by name', fakeAsync(() => {
    service.addCandidate(mockCandidateA); // 'Ana'
    service.addCandidate(mockCandidateB); // 'Carlos'
    tick();

    service.setFilter({ name: 'car' });

    let filteredList: Candidate[] = [];
    service.candidates$.pipe(first()).subscribe((list: Candidate[]) => filteredList = list);
    
    expect(filteredList.length).toBe(1);
    expect(filteredList[0].name).toBe('Carlos');
  }));

  it('should sort candidates by name ascending', fakeAsync(() => {
    service.addCandidate(mockCandidateC); // Beto
    service.addCandidate(mockCandidateA); // Ana
    service.addCandidate(mockCandidateB); // Carlos
    tick();

    service.setSort({ key: 'name', asc: true });

    let sortedList: Candidate[] = [];
    service.candidates$.pipe(first()).subscribe((list: Candidate[]) => sortedList = list);

    expect(sortedList[0].name).toBe('Ana');
    expect(sortedList[1].name).toBe('Beto');
    expect(sortedList[2].name).toBe('Carlos');
  }));

  it('should sort candidates by surname descending', fakeAsync(() => {
    service.addCandidate(mockCandidateA); // García
    service.addCandidate(mockCandidateC); // Pérez
    service.addCandidate(mockCandidateB); // López
    tick();

    service.setSort({ key: 'surname', asc: false });

    let sortedList: Candidate[] = [];
    service.candidates$.pipe(first()).subscribe((list: Candidate[]) => sortedList = list);
    
    // Orden esperado: Pérez (P), López (L), García (G)
    expect(sortedList[0].surname).toBe('Pérez'); 
    expect(sortedList[1].surname).toBe('López');
    expect(sortedList[2].surname).toBe('García');
  }));
});