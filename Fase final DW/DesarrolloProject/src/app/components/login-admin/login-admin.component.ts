import { Component, Injectable, OnInit } from '@angular/core';
// import {useNavigate} from "react-router-dom"
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormControlName,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ApisService } from '../../Services/apis.service';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css'],
})
export class LoginAdminComponent implements OnInit {
  crearFormulario: FormGroup;
  CodigoAcceso:any;
  codAcceso:any=[];

  constructor(
    public fb: FormBuilder,
    private toastr: ToastrService,
    private RestService: ApisService,
    private router: Router
  ) {
    this.crearFormulario = this.fb.group({
      CodFormulario: [Number, Validators.required],
      CodAcceso: [Number, Validators.required],
    });
  }

  ngOnInit(): void {
    this.CodigoAcceso = localStorage.getItem('CodigoAcceso');
  }

  public CargarCodigos() {
    // let arr: any = [];
    // let temp: any = [];

    let codform = this.crearFormulario.value.CodFormulario;
    let codAcc = this.crearFormulario.value.CodAcceso;

    // this.RestService.get(
    //   `https://26.153.179.223:44399/api/Permisoes/${codform}`
    // ).subscribe(
    //   (resp: any) => (
    //     console.log(resp.codigo_Acesso),
    //     (this.codAcceso=resp.codigo_Acesso)
    //   )
    // );
    let acc;
    this.RestService.get(
      `https://26.153.179.223:44399/api/Permisoes/?id=${codform}&codigoAcesso=${codAcc}`
    ).subscribe({
      next: (resp:any) => {

        console.log(resp);
        localStorage.setItem('CodigoFormulario', `${codform}`);
        localStorage.setItem('CodigoAcceso', `${codAcc}`);

        if (codAcc == resp.codigo_Acesso && codform==resp.id){
          this.toastr.success('Bienvenido');
          this.router.navigate(['/coordinacion']);
        }else{
          this.toastr.error(
            'El código de acceso ingresado es incorrecto, vuelva a intentarlo'
          );
          alert('Error');
        }
      },
      error: () => {
        console.log('ocurrió un error al hacer la petición');
        this.toastr.error(
          'El código ingresado es incorrecto, vuelva a intentarlo'
        );
        alert('Error');
      },
    });

    //--------OFICIAL POR AHORA----------
    // this.RestService.get(
    //   `https://26.153.179.223:44399/api/Permisoes/${codform}`
    // ).subscribe({
    //   next: (respuesta) => {
    //     // console.log(respuesta);
    //     localStorage.setItem('CodigoFormulario', `${codform}`);
    //     this.toastr.success('Bienvenido');
    //     this.router.navigate(['/coordinacion']);
    //   },
    //   error: () => {
    //     console.log('ocurrió un error al hacer la petición');
    //     this.toastr.error(
    //       'El código ingresado es incorrecto, vuelva a intentarlo'
    //     );
    //     alert('Error');
    //   },
    // });

  }

  administrar() {
    if (this.crearFormulario.valid) {
      this.crearFormulario.value.id_Estado = 'Pendiente';
      this.CargarCodigos();
      // this.EnviarFormulario();
      // console.log("La fecha es: " + this.createFormulario.value.fecha)
      // console.log( this.createFormulario.value)
      // this.toastr.success('Solicitud enviada con éxito');
      // this.createFormulario.reset(); //restablecer formulario;
    } else {
      this.toastr.warning('Completa el formulario');
    }
  }
}
