// libs/data-access/candidates/src/lib/candidates.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, combineLatest, firstValueFrom, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CandidateFormData, Candidate } from '@my-fullstack-app/candidates-api';
import { CANDIDATES_API_URL } from './api-url';


type CandidateFilter = { name?: string; surname?: string };
type CandidateSort = { key: 'name' | 'surname'; asc: boolean } | null;

@Injectable({
  providedIn: 'root',
})
export class CandidatesService {
  private http = inject(HttpClient);
  private apiUrl = inject(CANDIDATES_API_URL);

  // Estado interno (BehaviorSubjects)
  private _candidatesSubject = new BehaviorSubject<Candidate[]>([]);
  private _filterSubject = new BehaviorSubject<CandidateFilter>({});
  private _sortSubject = new BehaviorSubject<CandidateSort>(null);

  /** Observable público que combina el estado y aplica filtros/ordenación. */
  readonly candidates$: Observable<Candidate[]> = combineLatest([
    this._candidatesSubject.asObservable(),
    this._filterSubject.asObservable(),
    this._sortSubject.asObservable()
  ]).pipe(
    map(([candidates, filter, sort]) => {
      let result = [...candidates];

      // Filtrado
      if (filter.name) {
        result = result.filter(c => c.name.toLowerCase().includes(filter.name!.toLowerCase()));
      }
      if (filter.surname) {
        result = result.filter(c => c.surname.toLowerCase().includes(filter.surname!.toLowerCase()));
      }

      // Ordenación
      if (sort) {
        result.sort((a, b) => {
          const aVal = a[sort.key].toLowerCase();
          const bVal = b[sort.key].toLowerCase();
          return sort.asc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        });
      }

      return result;
    })
  );

  constructor() {
    this.loadCandidatesFromStorage();
  }

  // --- Métodos de Backend (HTTP) ---

  /** Sube los datos del candidato al servidor. */
  uploadCandidateData(data: CandidateFormData): Observable<Candidate> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('surname', data.surname);
    // Asegurarse de que el nombre del archivo se mantiene en el FormData
    formData.append('resumeFile', data.resumeFile, data.resumeFile.name);

    return this.http.post<Candidate>(`${this.apiUrl}/upload`, formData).pipe(
      catchError(err => {
        console.error('Error subiendo candidato', err);
        return throwError(() => err);
      })
    );
  }

  // --- Métodos de Gestión de Estado ---

  /** Agrega un candidato al store y actualiza localStorage. */
  addCandidate(newCandidate: Candidate): boolean {
    const current = this._candidatesSubject.getValue();

    // Comprobamos si ya existe un candidato con el mismo nombre y apellido
    const exists = current.some(
      c => c.name.toLowerCase() === newCandidate.name.toLowerCase() &&
        c.surname.toLowerCase() === newCandidate.surname.toLowerCase()
    );

    if (exists) {
      return false; // No se agrega
    }

    const updated = [...current, newCandidate];
    this._candidatesSubject.next(updated);
    this.saveCandidatesToStorage(updated);
    return true; // Se agregó correctamente
  }
  /** Limpia todos los candidatos del store y localStorage. */
  clearCandidates(): void {
    this._candidatesSubject.next([]);
    localStorage.removeItem('candidates');
  }

  /** Aplica un filtro por nombre y/o apellido. */
  setFilter(filter: CandidateFilter): void {
    this._filterSubject.next(filter);
  }

  /** Establece la clave y la dirección de la ordenación. */
  setSort(sort: CandidateSort): void {
    this._sortSubject.next(sort);
  }

  // --- Persistencia (localStorage) ---

  private saveCandidatesToStorage(candidates: Candidate[]): void {
    try {
      localStorage.setItem('candidates', JSON.stringify(candidates));
    } catch (err) {
      console.error('Error guardando candidatos en localStorage', err);
    }
  }

  private loadCandidatesFromStorage(): void {
    const stored = localStorage.getItem('candidates');
    if (!stored) return;

    try {
      const candidates: Candidate[] = JSON.parse(stored);
      if (Array.isArray(candidates)) this._candidatesSubject.next(candidates);
    } catch (err) {
      console.error('Error parsing candidates from localStorage', err);
    }
  }
}