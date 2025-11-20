import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Observable } from 'rxjs'; 
import { Candidate } from '@my-fullstack-app/candidates-api'; 
import { CandidatesService } from '@my-fullstack-app/data-access'; 
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'lib-candidates-table',
  standalone: true, 
  imports: [CommonModule, MatTableModule], 
  templateUrl: './candidates-table.html',
  styleUrls: ['./candidates-table.css'],
})
export class CandidatesTable {
  private candidatesService = inject(CandidatesService); 
  candidates$: Observable<Candidate[]> = this.candidatesService.candidates$;

  displayedColumns: string[] = ['name', 'surname', 'seniority', 'yearsOfExperience', 'availability'];
}
