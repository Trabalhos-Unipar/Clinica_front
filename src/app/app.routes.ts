import { Routes } from '@angular/router';
import { Home } from './telas/home/home';
import { Consultas } from './telas/consultas/consultas';
//import { Paciente } from './telas/cadastros/paciente/paciente';
import { Medico } from './telas/cadastros/medico/medico';
import { PacienteListar } from './telas/cadastros/paciente/paciente-listar/paciente-listar';

export const routes: Routes = [
    {
    path: 'home',
    component:Home,
},
 {
    path: 'consultas',
   component:Consultas,
    },
   {
    path: 'pacientes',
    loadChildren:()=>
        import('./telas/cadastros/paciente/paciente-route').then((m=>m.PACIENTE_ROUTES))  ,
    },
    {
    path: 'medicos',
   component:Medico,
    },
];
