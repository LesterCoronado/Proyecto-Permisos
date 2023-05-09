import { Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApisService } from '../../Services/apis.service';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css'],
})
export class LoginAdminComponent implements OnInit {
  crearFormulario: FormGroup;
  CodigoAcceso: any;

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

  public BuscarPermiso() { //Busca el permiso de un estudiante 
    let cod_form = this.crearFormulario.value.CodFormulario;
    let cod_acces = this.crearFormulario.value.CodAcceso;

    this.RestService.get(
      `https://26.153.179.223:44399/api/Permisoes/?id=${cod_form}&codigoAcesso=${cod_acces}`
    ).subscribe({
      next: (resp: any) => {
        console.log(resp);
        localStorage.setItem('CodigoFormulario', `${cod_form}`);
        localStorage.setItem('CodigoAcceso', `${cod_acces}`);

        if (cod_acces == resp.codigo_Acesso && cod_form == resp.id) {
          this.router.navigate(['/coordinacion']);
          this.toastr.success('Bienvenido');
        } else {
          this.toastr.error(
            'El código de acceso ingresado es incorrecto, vuelva a intentarlo'
          );
          
        }
      },
      error: () => {
        this.toastr.error(
          'ocurrió un error al hacer la petición al servidor'
        );
        
      },
    });

  }

  Formulario() {
    if (this.crearFormulario.valid) {
      this.crearFormulario.value.id_Estado = 'Pendiente';
      this.BuscarPermiso();

    } else {
      this.toastr.warning('Completa el formulario');
    }
  }
}
