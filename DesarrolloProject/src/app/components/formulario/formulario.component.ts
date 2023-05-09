import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ApisService } from '../../Services/apis.service';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
})
export class FormularioComponent implements OnInit {
  createFormulario: FormGroup;

  CARNET = '';
  Cursos: any = []; //Contiene la lista de los todos los cursos que un alumno tiene asignados.
  Motivos: any = []; //Contiene la lista de los diferentes motivos por los que se puede faltar a clase.
  data: any;
  carnet: number = 0; //Contiene el carnet del estudiante
  respuesta: Object = new Object();
  previsualizacion: string = '';
  public archivos: any = [];
  loading: boolean = false;
  email: any; //Contiene el correo del estudiante

  constructor(
    public fb: FormBuilder,
    private toastr: ToastrService,
    private RestService: ApisService,
    private sanitizer: DomSanitizer
  ) {
    /* Este es un objeto Formulario, que contiene 
    todos los atributos del formulario de Permisos UMG*/
    this.createFormulario = this.fb.group({
      id_Motivo: [Number, Validators.required],
      id_Estado: [Number],
      fecha: ['', Validators.required],
      descripcion: ['', Validators.required],
      foto: ['', Validators.required],
      id_AsignacionCurso: [Number, Validators.required],
    });
  }

  ngOnInit(): void {
    /*Aqui inicializamos lo que queremos 
   que se ejecute automaticamente al cargar la aplicacion*/
    this.email = sessionStorage.getItem('email');
    console.log('respuesta del local: ' + this.email);
    this.CargarCursos();
    this.CargarMotivos();
  }

  /*Esta funcion captura las imagenes o documentos 
  que los alumnos suban como justificacion de su permiso.*/
  capturarFile(event: any): any {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      console.log(file);

      if (
        file.type == 'image/jpeg' ||
        file.type == 'image/png' ||
        file.type == 'application/pdf'
      ) {
        const archivoCapturado = event.target.files[0];
        this.extraerBase64(archivoCapturado).then((imagen: any) => {
          this.previsualizacion = imagen.base;
          console.log(imagen);
          this.createFormulario.value.foto = imagen.base;
        });
        this.archivos.push(archivoCapturado);
      } else {
        this.toastr.error(
          'Asegurate de haber seleccionado una extensión válida para tu archivo.'
        );
      }
    }
  }

  //Este es el procedimiento para convertir los archivos a base64
  extraerBase64 = async ($event: any) =>
    new Promise((resolve: any) => {
      try {
        const unsafeImg = window.URL.createObjectURL($event);
        const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
        const reader = new FileReader();
        reader.readAsDataURL($event);
        reader.onload = () => {
          resolve({
            base: reader.result,
          });
        };
        reader.onerror = (error) => {
          resolve({
            base: null,
          });
        };
        return true;
      } catch (e) {
        return null;
      }
    });

  //Funcion para eliminar archivo seleccionado
  clearImage(): any {
    this.previsualizacion = '';
    this.archivos = [];
    this.createFormulario.controls['foto'].reset();
  }

  //Esta funcion sirve para mostrarle todos sus cursos asignados al alumno
  public CargarCursos() {
    let arr: any = [];
    let temp: any = [];
    console.log('Email: ' + this.email);

    this.RestService.get(
      `https://26.153.179.223:44399/api/Estudiantes/?correo=${this.email}`
    ).subscribe(
      (resp: any) => (
        console.log('Aqui abajo la respuesta: '),
        console.log(resp),
        (temp = resp),
        (arr = temp.AsignacionCursoes),
        (this.Cursos = arr),
        console.log(this.Cursos)
      )
    );
  }

  //Esta funcion nos sirve para obtener todos los motivos para que los alumnos puedan seleccionar uno
  public CargarMotivos() {
    let temp: any = [];

    this.RestService.get(`https://26.153.179.223:44399/api/Motivoes`).subscribe(
      (resp: any) => (
        // console.log(resp),
        (temp = resp), (this.Motivos = temp)
        // console.log(this.Motivos)
      )
    );
  }

  //Esta funcion nos sirve para enviar los datos del formulario al servidor
  public EnviarFormulario() {
    this.RestService.post(
      `https://26.153.179.223:44399/api/Permisoes`, //URL de la api
      this.createFormulario.value //le pasamos el objeto formulario
    ).subscribe({
      //Esto de next y error , nos sirve para tener un mejor manejo de los errores en las peticiones al servidor
      next: (resp: any) => {
        console.log(resp);
        this.createFormulario.reset(); //restablecer formulario
        this.clearImage(); //limpiar imagen
        this.toastr.success('Éxito');
      },
      error: () => {
        console.log('ocurrió un error al hacer la petición');
        this.toastr.error(
          'Ocurrió un error enviando el permiso, intentalo nuevamente'
        );
      },
    });
  }

  /*Dentro de esta funcion validamos que los datos ingresados por los alumnos 
  al formulario sean correctos antes de guardarlos*/
  Formulario() {
    if (this.createFormulario.valid) {
      this.createFormulario.value.id_Estado = 1;
      this.EnviarFormulario();
      console.log(this.createFormulario.value);

    } else {
      this.toastr.warning('Completa el formulario');
    }
  }
}
