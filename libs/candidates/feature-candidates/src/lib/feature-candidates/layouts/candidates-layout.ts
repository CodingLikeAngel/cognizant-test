// libs/feature/candidates/ui/src/lib/layouts/candidates-layout/candidates-layout.component.ts

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidatesForm } from '../components/form/candidates-form';
import { CandidatesTable } from '../components/table/candidates-table';
import { MatIcon } from "@angular/material/icon";
import { CandidatesService } from '@my-fullstack-app/data-access';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputField } from '@my-fullstack-app/ui-form-fields';
@Component({
  selector: 'lib-candidates-layout',
  standalone: true,
  imports: [CommonModule, CandidatesForm, CandidatesTable, MatIcon, ReactiveFormsModule, InputField], 
  templateUrl: './candidates-layout.html',
  styleUrl: './candidates-layout.css',
})
export class CandidatesLayoutComponent   implements OnInit {
  private fb = inject(FormBuilder);
   candidatesService = inject(CandidatesService);

  filterForm!: FormGroup;

  ngOnInit() {
    this.filterForm = this.fb.group({
      name: [''],
      surname: ['']
    });

    this.filterForm.valueChanges.subscribe(values => {
      this.candidatesService.setFilter({
        name: values.name,
        surname: values.surname
      });
    });
  }

  clearAllCandidates(): void {
  const confirmDelete = confirm('¿Estás seguro de que quieres borrar todos los candidatos?');
  if (confirmDelete) {
    this.candidatesService.clearCandidates();
  }
}
}