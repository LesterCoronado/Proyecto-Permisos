import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//cosas importantes a importar
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; //para el formulario
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr'; //Para las alertas
import { HttpClient, HttpClientModule } from '@angular/common/http'; //Para trabajar con las apis
import { FormularioComponent } from './components/formulario/formulario.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { AboutComponent } from './components/about/about.component';
import { PermisosComponent } from './components/permisos/permisos.component';

import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from '@abacritt/angularx-social-login';
import { LoginComponent } from './components/login/login.component';
import { CoordinacionComponent } from './components/coordinacion/coordinacion.component';
import { LoginAdminComponent } from './components/login-admin/login-admin.component';

@NgModule({
  declarations: [
    AppComponent,
    FormularioComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    AboutComponent,
    PermisosComponent,
    LoginComponent,
    CoordinacionComponent,
    LoginAdminComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocialLoginModule,


 //importante
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    HttpClientModule, //Para manejo de APIS

  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '706607850638-15p762d05detroqn2gfu51blhn1rpsi2.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('clientId')
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
