import { Routes } from '@angular/router';
import { Home } from './telas/home/home';
import { Consultas } from './telas/consultas/consultas';
//import { Paciente } from './telas/cadastros/paciente/paciente';
import { Medico } from './telas/cadastros/medico/medico';

export const routes: Routes = [
    {
    path: 'home',
    component:Home,
},
 {
    path: 'consultas',
   component:Consultas,
    },
   // {
    //path: 'pacientes',
   //component:Paciente,
    //},
    {
    path: 'medicos',
   component:Medico,
    },
];
