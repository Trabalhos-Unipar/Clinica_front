import { Routes } from '@angular/router';
import { Home } from './telas/home/home';

export const routes: Routes = [
    {
    path: 'home',
    component:Home,
},
 {
    path: 'consultas',
   loadChildren:()=>
        import('./telas/cadastros/consultas/consultas-route').then((m=>m.CONSULTA_ROUTES))  ,
    },
   {
    path: 'pacientes',
    loadChildren:()=>
        import('./telas/cadastros/paciente/paciente-route').then((m=>m.PACIENTE_ROUTES)),
    },
    {
    path: 'medicos',
    loadChildren:()=>
        import('./telas/cadastros/medico/medico-route').then((m=>m.MEDICO_ROUTES)),
    },
    {
    path: 'especialidades',
   loadChildren:()=>
        import('./telas/cadastros/especialidades/especialidades-route').then((m=>m.ESPECIALIDADE_ROUTES)),
    },
    
];
