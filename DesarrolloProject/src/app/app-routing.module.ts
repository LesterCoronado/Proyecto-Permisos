import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { FormularioComponent } from './components/formulario/formulario.component';
import { HomeComponent } from './components/home/home.component';
import { PermisosComponent } from './components/permisos/permisos.component';
import { LoginComponent } from './components/login/login.component';
import {CoordinacionComponent} from './components/coordinacion/coordinacion.component';
import {LoginAdminComponent} from './components//login-admin/login-admin.component';

const routes: Routes = [
  {path: '', redirectTo:'/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'about', component: AboutComponent},
  {path: 'permisos', component: PermisosComponent},
  {path:'formulario',component:FormularioComponent},
  {path:'login',component:LoginComponent},
  {path: 'coordinacion', component:CoordinacionComponent},
  {path: 'loginAdmin', component:LoginAdminComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
