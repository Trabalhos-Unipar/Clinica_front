import { Routes } from '@angular/router';
export const ESPECIALIDADE_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'listar' },
  {
    path: 'listar',
    loadComponent: () =>
      import('./especialidades-listar/especialidades-listar').then(m => m.EspecialidadesListar)
  },
 
];