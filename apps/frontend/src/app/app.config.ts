import {
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { ApplicationConfig, importProvidersFrom } from '@angular/core'; 
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { CANDIDATES_API_URL } from '@my-fullstack-app/data-access';
import { environment } from './environments/environment';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    importProvidersFrom(ReactiveFormsModule),
     provideHttpClient(), 
    {
      provide: CANDIDATES_API_URL,
      useValue: `${environment.apiUrl}/candidates` // InjectionToken
    }, 
  ],
};