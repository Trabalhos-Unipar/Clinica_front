import { Routes } from '@angular/router';

export const CONSULTA_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'listar' },
  {
    path: 'listar',
    loadComponent: () =>
      import('./consultas-listar/consultas-listar').then(m => m.ConsultasListar)
  },
 
];