// libs/feature/candidates/shell/src/lib/candidates.routes.ts

import { Route } from '@angular/router';

import { CandidatesLayoutComponent } from '@my-fullstack-app/feature-candidates'; 


export const CANDIDATES_ROUTES: Route[] = [
  {
    path: '', 
    component: CandidatesLayoutComponent,
    children: [

    ],
  },
];