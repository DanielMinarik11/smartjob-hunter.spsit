import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/jobs/pages/job-board').then((module) => module.JobBoard),
  },
];
