import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ApisService } from '../../Services/apis.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coordinacion',
  templateUrl: './coordinacion.component.html',
  styleUrls: ['./coordinacion.component.css'],
})
export class CoordinacionComponent implements OnInit {
  Formulario: any = [];
  CodigoFormulario: any;
  CodigoAcceso: any;
  foto: any;

  constructor(
    private toastr: ToastrService,
    private RestService: ApisService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}
  showMe: boolean = false;
  showMe2: boolean = false;

  ngOnInit(): void {
    // Aqui inicializamos lo que queremos que se ejecute automaticamente al cargar la aplicacion
    
    this.CodigoFormulario = localStorage.getItem('CodigoFormulario'); //Manda a traer el codigo de formulario
    this.CodigoAcceso = localStorage.getItem('CodigoAcceso'); //Manda a traer el codigo acceso al formulario
    this.CargarFormulario();
  }
  toogleTag() {
    this.showMe = !this.showMe;
  }
  toogleTag2() {
    this.showMe2 = !this.showMe2;
  }

  public CargarFormulario() {
    let arr: any = [];
    let temp: any = [];

    //Haciendo una llamada GET a la api rest, en busca del permiso
    this.RestService.get(
      `https://26.153.179.223:44399/api/Permisoes/?id=${this.CodigoFormulario}&codigoAcesso=${this.CodigoAcceso}`
    ).subscribe(
      (resp: any) => (
        console.log('Aqui abajo la respuesta: '),
        console.log(resp),
        localStorage.setItem('CodigoAcceso', `${resp.codigoAcesso}`),
        (this.foto = resp.foto),
        (this.foto = this.sanitizer.bypassSecurityTrustResourceUrl(
          'data:image/jpg;base64,' + this.foto.base64string
        )),
        (this.Formulario = resp),
        console.log('Formulario:'),
        console.log(this.Formulario),
        localStorage.setItem('datos', `${this.Formulario}`)
      )
    );
  }

  //Funcion para aceptar un permiso
  aceptar() {
    //Creando un nuevo array que contiene los datos del formulario del alumno
    let jeyson = {
      id: this.Formulario.id,
      id_AsignacionCurso: this.Formulario.id_AsignacionCurso,
      id_Motivo: this.Formulario.id_Motivo,
      id_Estado: 2, //le asignamos este numero porque era de aceptacion,segun la bd que usamos 
      fecha: this.Formulario.fecha,
      descripcion: this.Formulario.descripcion,
      foto: this.Formulario.foto,
      codigo_Acesso: this.Formulario.codigo_Acesso,
    };


      //hacemos un PUT para alterar el estado del permiso y le pasamos el array que creamos
      this.RestService.put(
        `https://26.153.179.223:44399/api/Permisoes/${this.CodigoFormulario}`,
        jeyson 
      ).subscribe((resp: any) => console.log(resp));
    this.toastr.success('Se ha aceptado el permiso con éxito');
    this.router.navigate(['/home']);
  }

  //Funcion para rechazar un permisos
  rechazar() {
    let jeyson = {
      id: this.Formulario.id,
      id_AsignacionCurso: this.Formulario.id_AsignacionCurso,
      id_Motivo: this.Formulario.id_Motivo,
      id_Estado: 3, //este numero era para rechazar un permiso segun la bd
      fecha: this.Formulario.fecha,
      descripcion: this.Formulario.descripcion,
      foto: this.Formulario.foto,
      codigo_Acesso: this.Formulario.codigo_Acesso,
    };
    
   //hacemos un PUT para alterar el estado del permiso y le pasamos el array que creamos
      this.RestService.put(
        `https://26.153.179.223:44399/api/Permisoes/${this.CodigoFormulario}`,
        jeyson
      ).subscribe((resp: any) => console.log(resp));

    this.toastr.error('Permiso rechazado');
    this.router.navigate(['/home']);
  }
}
