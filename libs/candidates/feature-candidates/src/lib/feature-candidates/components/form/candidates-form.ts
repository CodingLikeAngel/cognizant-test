import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Candidate } from '@my-fullstack-app/candidates-api';
import { CandidatesService } from '@my-fullstack-app/data-access';
import { InputField, FileReaderField } from '@my-fullstack-app/ui-form-fields';
import { MatIconModule } from "@angular/material/icon";


@Component({
  selector: 'lib-candidates-form',
  standalone: true,
  imports: [
    CommonModule,

    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    InputField,
    FileReaderField,
  ],
  templateUrl: './candidates-form.html',
  styleUrls: ['./candidates-form.css'],
})
export class CandidatesForm implements OnInit {
  private fb = inject(FormBuilder);
  private candidatesService = inject(CandidatesService);

  candidateForm!: FormGroup;
  notification = signal<{ type: 'success' | 'error'; message: string } | null>(null);

  ngOnInit(): void {
    this.candidateForm = this.fb.group({
      name: this.fb.control<string>('', Validators.required),
      surname: this.fb.control<string>('', Validators.required),
      resumeFile: this.fb.control<File | null>(null, Validators.required),
    });
  }

  onSubmit(): void {
    if (this.candidateForm.valid) {
      const data = this.candidateForm.value;

      this.candidatesService.uploadCandidateData(data).subscribe({
        next: (response: Candidate) => {
          const added = this.candidatesService.addCandidate(response);

          if (added) {
            this.candidateForm.reset();
            this.showNotification('success', '¡Candidato agregado con éxito!');
          } else {
            this.showNotification('error', 'El candidato ya existe en la tabla.');
          }
        },
        error: (err) => {
          const errorMessage = err.error?.message || 'Error al procesar el candidato. ¡Inténtalo de nuevo!';
          this.showNotification('error', errorMessage);
        },
      });
    }
  }

  showNotification(type: 'success' | 'error', message: string) {
    this.notification.set({ type, message });

    setTimeout(() => {
      this.notification.set(null);
    }, 4000);
  }
}
