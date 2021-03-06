import { Component, OnInit } from '@angular/core';
import { ProcessConfiguration, Sede } from '../../common/models/configuration.model';
import { DataConfiguration } from '../../common/services/configuration.service';
import { DataInformation } from '../../common/services/basicInformation.service';
import { FacultyInformation } from '../../common/services/faculty.service';
import { EmailConfiguration } from '../../common/services/email.service';
import { Email, BodyEmail } from '../../common/models/email.model';
import { Constants } from '../../common/constants/model.constants';
import { unescapeIdentifier } from '@angular/compiler';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  configurationLocal: ProcessConfiguration;
  email: Email;
  bodyEmail: BodyEmail;
  testMessage: any;
  saveMessage: any;
  configuracionVerificadores: Sede;
  modelFacultyInformation: {} = {};
  facultySelected: string;
  verifierSelected: string;
  findFaculty: boolean;
  findVerifier: boolean;
  i: number;
  j: number;

  verificadores: Array<string> = ["Verificador 1",
                                  "Verificador 2",
                                  "Verificador 3",
                                  "Verificador 4",
                                  "Verificador 5",
                                  "Verificador 6",
                                  "Verificador 7",
                                  "Verificador 8",
                                  "Verificador 9",
                                  "Verificador 10"];

  constructor(private _processConfiguration: ProcessConfiguration,
              private _dataConfiguration: DataConfiguration,
              private _dataInformation: DataInformation,
              private _facultyInformation: FacultyInformation,
              private _emailConfiguration: EmailConfiguration,
              private _constants: Constants) 
  {
    this.CallServiceFaculty();
    this.testMessage = null;
    setTimeout(() => this._facultyInformation.waitService = true,0);
    this._emailConfiguration.GetAdminInformation().subscribe( data => {
      this.email = data;
      this._emailConfiguration.email = data;
      for(this.i = 0; this.i <= this.email.text.length; this.i++) {
        this.email.text = this.email.text.replace('<br>','\n');
      }
      setTimeout(() => this._facultyInformation.waitService = false,0);
    });

    this._dataConfiguration.GetVerifier().subscribe( data => {
      this._dataConfiguration.sede = data;
      this.configurationLocal.configuracionverificadores = data;
    });
  }
              

  ngOnInit() {
    this.modelFacultyInformation = this._facultyInformation.facultyInformation;
    this.configurationLocal = this._dataConfiguration.configuration;
  }

  /*      AGREGAR Y ELIMINAR SEDES DE REFRIGERIO NOCTURNO */
  // Guardar Facultad en variable local
  SaveFaculty(deviceValue) {
    deviceValue = deviceValue.replace("/","-");
    this.facultySelected = deviceValue;
  }
  // Agregar facultad a lista
  AddFaculty() {
    if(this.facultySelected != "") {
      if(this.configurationLocal.refrigerionocturno.indexOf(this.facultySelected) == -1 && this.facultySelected != undefined) {
        this.configurationLocal.refrigerionocturno.push(this.facultySelected);
      }
    }
  }
  // Eliminar facultad de lista
  RemoveFaculty() {
    if(this.facultySelected != "") {
      if(this.configurationLocal.refrigerionocturno.indexOf(this.facultySelected) > -1 && this.facultySelected != undefined) {
        this.configurationLocal.refrigerionocturno.splice(this.configurationLocal.refrigerionocturno.indexOf(this.facultySelected),1);
      }
    }
  }
  /*      AGREGAR O ELIMNAR VERIFICADORES DE SEDES    */
  // Guardar Verificador en variable
  SaveVerifier(deviceValue) {
    this.verifierSelected = deviceValue;
  }
  // Agregar verificador a la lista
  AddVerifier() {
    if (this.facultySelected != undefined && this.facultySelected != '' && this.verifierSelected != undefined && this.verifierSelected != '') {
      if (this.configurationLocal.configuracionverificadores == undefined || this.configurationLocal.configuracionverificadores == null){
        this.configurationLocal.configuracionverificadores = new Array<Sede>();
      }
      if (this.configurationLocal.configuracionverificadores.length == 0) {
        //  LOCAL 
        this.configuracionVerificadores = new Sede(this.facultySelected, this.verifierSelected);
        this.configurationLocal.configuracionverificadores.push(this.configuracionVerificadores);
      } else {
        for(this.i = 0; this.i <= this.configurationLocal.configuracionverificadores.length - 1; this.i++) {
          if (this.configurationLocal.configuracionverificadores[this.i].nombre == this.facultySelected) {
            this.findFaculty = true;
            break;
          } else {
            this.findFaculty = false;
          }
        }
        if (this.findFaculty) {
          for(this.j = 0; this.j <= this.configurationLocal.configuracionverificadores[this.i].verificadores.length - 1; this.j++) {
            if (this.configurationLocal.configuracionverificadores[this.i].verificadores[this.j] == this.verifierSelected) {
              this.findVerifier = true;
              break;
            } else {
              this.findVerifier = false;
            }
          }
          if (!this.findVerifier) {
            //  LOCAL
            this.configurationLocal.configuracionverificadores[this.i].verificadores.push(this.verifierSelected);
          }
        } else {
          //  LOCAL
          this.configuracionVerificadores = new Sede(this.facultySelected, this.verifierSelected);
          this.configurationLocal.configuracionverificadores.push(this.configuracionVerificadores);
        }
      }
    }
  }
  // Eliminar verificador de lista
  RemoveVerifier() {
    this.findFaculty = false;
    this.findVerifier = false;
    if(this.facultySelected != undefined && this.verifierSelected != undefined) {
      if (this.configurationLocal.configuracionverificadores != undefined) {
        for (this.i = 0; this.i <= this.configurationLocal.configuracionverificadores.length - 1; this.i++) {
          if (this.configurationLocal.configuracionverificadores[this.i].nombre == this.facultySelected) {
            this.findFaculty = true;
            break;
          }
        }
        if (this.findFaculty) {
          if (this.configurationLocal.configuracionverificadores[this.i].verificadores.length >= 1) {
            for (this.j = 0; this.j <= this.configurationLocal.configuracionverificadores[this.i].verificadores.length -1; this.j++) {
              if (this.configurationLocal.configuracionverificadores[this.i].verificadores[this.j] == this.verifierSelected) {
                this.findVerifier = true;
                break;
              }
            }
            if (this.findVerifier) {
              if (this.configurationLocal.configuracionverificadores[this.i].verificadores.length == 1) {
                // this.configurationLocal.configuracionverificadores[this.i].verificadores.splice(this.configurationLocal.configuracionverificadores[this.i].verificadores.indexOf(this.verifierSelected),1);
                this.configurationLocal.configuracionverificadores.splice(this.i,1);
              } else {
                this.configurationLocal.configuracionverificadores[this.i].verificadores.splice(this.configurationLocal.configuracionverificadores[this.i].verificadores.indexOf(this.verifierSelected),1);
              }
              //
            }
          } else {
            this.configurationLocal.configuracionverificadores.splice(this.i, 1);
          }
        }
      }
    }
  }

  /*    Guardar verificadore en BD  */
  PutVerifier() {
    this._dataConfiguration.PutVerifier(this.configurationLocal).subscribe();
  }

  /*      Probrar conexion de correo      */
  TestConnection(action: string) {
    setTimeout(() => this._facultyInformation.waitService = true,0);
    this._emailConfiguration.PutConfiguration(this.email, this._constants.pathTestConnection).subscribe((data) => {
    if (action == "Test") {
      // debugger;
      if (data.json() == 1) {
        this.testMessage = 1;
      } else {
        this.testMessage = data;
      }
    } else if (action == "Save") {
      if (data.json() == 1) {
        this.SaveEmailConfiguration(); 
      } else {
        this.saveMessage = "No se guardaron los cambios   " + data.json();
      }
    }
    setTimeout(() => this._facultyInformation.waitService = false,0);
    });
  }
  /* Guardar configuración de Email */
  SaveEmailConfiguration() {
    setTimeout(() => this._facultyInformation.waitService = true,0);
    this._emailConfiguration.PutConfiguration(this.email, this._constants.pathEmailConfiguration).subscribe((data) => {
      this.saveMessage = data.json();
      setTimeout(() => this._facultyInformation.waitService = false,0);
    });
  }
  /*      EMAIL CONFIG END        */

  /* Organizar elementos de listas */
  trackByIndex(index: number, obj: any): any {
    return index;
  }

  /* Guardar configuración de módulo de inscripción */
  putConfiguration() {
    setTimeout(() => this._facultyInformation.waitService = true,0);
    this._dataConfiguration.configuration = this.configurationLocal;
    this._dataConfiguration.PutConfiguration()
      .subscribe((datad)=>{
        this.testMessage = datad;
        this.PutVerifier();
              setTimeout(() => this._facultyInformation.waitService = false,0);
          });
  }

  /*  LISTAR FACULTADES ACTUALES*/
  private CallServiceFaculty() {
    setTimeout(() => this._facultyInformation.waitService = true,0);
    if (this._facultyInformation.facultyInformation == null){ 
      this._facultyInformation.GetFacultyInformation()
      .subscribe(data => {
        if(data.infoFacultadesColleccion.infoFacultades.length > 0) {
          this._facultyInformation.facultyInformation = data.infoFacultadesColleccion.infoFacultades;   
          this.modelFacultyInformation = data.infoFacultadesColleccion.infoFacultades;
          setTimeout(() => this._facultyInformation.waitService = false,0);
        } 
      },
      error => {
        console.log(error);
      });
    }  else {
      setTimeout(() => this._facultyInformation.waitService = false,0);
    }   
  }
}