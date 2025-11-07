import { Routes } from '@angular/router';
import { MedicoService } from './medico-service';

export const MEDICO_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'listar' },
  {
    path: 'listar',
    loadComponent: () =>
      import('./medico-listar/medico-listar').then((m) => m.MedicoListar),
  },
];