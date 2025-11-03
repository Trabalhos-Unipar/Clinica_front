import { Routes } from '@angular/router';
import { PacienteService } from './paciente-service';
export const PACIENTE_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'listar' },
  {
    path: 'listar',
    loadComponent: () =>
      import('./paciente-listar/paciente-listar').then(m => m.PacienteListar)
  },
 
];