import { Component, Injectable, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
import { JQueryStyleEventEmitter } from 'rxjs/internal/observable/fromEvent';



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
  Cursos: any = []; //Contiene la lista de los cursos obtenidos en la petición de API
  Motivos: any = []; //Contiene la lista de los motivos obtenidos en la petición de API
  data: any;
  carnet: number = 0;
  respuesta: Object = new Object();
  previsualizacion: string = '';
  public archivos: any = [];
  loading: boolean = false;
  correo: string = '';
  email:any;
  public video: Array<any> = [];



  constructor(
    public fb: FormBuilder,
    private toastr: ToastrService,
    private RestService: ApisService,
    private sanitizer: DomSanitizer,
    
  ) {
    //Creamos un Formulario
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
    // Aqui inicializamos lo que queremos que se ejecute automaticamente al cargar la aplicacion
   
   this.email = sessionStorage.getItem('email'); //Jalamos el correo del alumno
   console.log("respuesta del local: "+ this.email); //comprobamos la data xd

   this.CargarCursos();

   this.CargarMotivos();
  }

 
//Esta funcion es para  captura los archivos 
  capturarFile(event: any): any {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      console.log(file);
      //Dentro de este if, van las extensiones de los archivos que le permitimos a los alumnos que suban
      if (

        file.type == 'image/png'

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
          'Asegurate de haber seleccionado una extensión .png para tu archivo.'
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

  //Esta funcion no se usa 
  subirArchivo(): any {
    try {
      this.loading = true;
      const formularioDeDatos = new FormData();
      this.archivos.forEach((archivo: any) => {
        formularioDeDatos.append('files', archivo);
      });
      this.RestService.post(`   `, formularioDeDatos) //cambiar URL
        .subscribe(
          (res) => {
            this.loading = false;
            console.log('Respuesta del servidor', res);
          },
          () => {
            this.loading = false;
            alert('Error');
          }
        );
    } catch (e) {
      this.loading = false;
      console.log('ERROR', e);
    }
  }

  //Esta funcion sirve para mostrarle todos sus cursos asignados al alumno
  public CargarCursos() {
    let arr: any = [];
    let temp: any = [];
    console.log ("Email: "+this.email);


        this.RestService.get(
          `https://26.153.179.223:44399/api/Estudiantes/?correo=${ this.email }`
        ).subscribe(
          (resp: any) => (
            console.log("Aqui abajo la respuesta: "),
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

    this.RestService.get(`https://26.153.179.223:44399/api/Motivoes`
    ).subscribe(
      (resp: any) => (
        // console.log(resp),
        (temp = resp),
        this.Motivos = temp
        // console.log(this.Motivos)
        )
      );
  }

  //Esta funcion nos sirve para una vez llenado el formulario se pueda enviar al servidor
  public EnviarFormulario() {
    this.RestService.post(
      `https://26.153.179.223:44399/api/Permisoes`, //cambiar URL
      this.createFormulario.value //le pasamos todo el formulario
    ).subscribe({

      //Esto de next y error , nos sirve para tener un mejor manejo de los errores en las peticiones al servidor

      next: (resp:any) => {

        console.log(resp);
        this.createFormulario.reset(); //restablecer formulario
        this.clearImage();//limpiar imagen
        this.toastr.success(
          'Éxito'
        );

        
      },
      error: () => {
        console.log('ocurrió un error al hacer la petición');
        this.toastr.error(
          'Ocurrió un error enviando el permiso, intentalo nuevamente'
        );
        
      },


  });
  }

  addReporte() {
    if (this.createFormulario.valid) {
      this.createFormulario.value.id_Estado = 1;
      this.EnviarFormulario();
      console.log("La fecha es: " + this.createFormulario.value.fecha)
      console.log( this.createFormulario.value)
      
      console.log(this.createFormulario.value.id_Motivo*this.createFormulario.value.id_AsignacionCurso)
     
     
    } else {
      this.toastr.warning('Completa el formulario');
    }
  }

  logear(e: any) {
    if (e.toString().length > 4) {
      this.toastr.error('El numero de carrera no puede ser mayor a 4');
      console.log('El numero de carrera no puede ser mayor a 4');
    }
    console.log(e);
  }
}
