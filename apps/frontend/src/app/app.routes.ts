import { Route } from '@angular/router';
import { NxWelcomeComponent } from './welcome';


export const appRoutes: Route[] = [
  {
    path: '',
    component: NxWelcomeComponent,
  },
  {
    path: 'candidates',
    loadChildren: () =>
      import('@my-fullstack-app/candidates-shell').then(
        (m) => m.CANDIDATES_ROUTES
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];