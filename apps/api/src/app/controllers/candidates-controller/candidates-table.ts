// libs/feature/candidates/ui/src/lib/components/candidates-table/candidates-table.component.ts

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
// 🔑 Importamos Observable para tipar correctamente
import { Observable } from 'rxjs'; 

// Importamos la interfaz del candidato y el servicio
import { Candidate } from '@my-fullstack-app/candidates-api'; 
import { CandidatesService } from '@my-fullstack-app/data-access'; 
// Importamos los componentes compartidos
import { UiTable, TableColumn } from '@my-fullstack-app/ui-components'; 

@Component({
  selector: 'lib-candidates-table',
  standalone: true, 
  imports: [CommonModule, UiTable], 
  templateUrl: './candidates-table.html',
  styleUrl: './candidates-table.css',
})
export class CandidatesTable {
  private candidatesService = inject(CandidatesService); 
  
  // 🔑 CAMBIO: Tipamos el Observable usando la interfaz Candidate
  candidates$: Observable<Candidate[]> = this.candidatesService.candidates$;

  // 2. Definición de la configuración de columnas
  columnConfig: TableColumn[] = [
    { key: 'name', header: 'Nombre' },
    { key: 'surname', header: 'Apellido' },
    { key: 'seniority', header: 'Nivel' },
    { key: 'yearsOfExperience', header: 'Experiencia (años)' },
    { key: 'availability', header: 'Disponible' },
  ];
}