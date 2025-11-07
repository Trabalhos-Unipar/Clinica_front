import { Routes } from '@angular/router';
import { Home } from './telas/home/home';
import { Consultas } from './telas/consultas/consultas';
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
    loadChildren:()=>
        import('./telas/cadastros/medico/medico-route').then((m=>m.MEDICO_ROUTES))  ,
    },
    {
    path: 'especialidades',
   loadChildren:()=>
        import('./telas/cadastros/especialidades/especialidades-route').then((m=>m.ESPECIALIDADE_ROUTES))  ,
    },
];
