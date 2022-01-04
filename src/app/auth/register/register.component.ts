import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {Store} from "@ngrx/store";
import {AppState} from "../../app.reducer";
import {Subscription} from "rxjs";
import * as ui from "../../shared/ui.actions";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm: FormGroup;
  cargando: boolean = false;
  uiSubscription: Subscription;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private store: Store<AppState>,
              private router: Router) {
    this.registroForm = this.fb.group({
      nombre: ['claudio', Validators.required ],
      correo: ['claudio@gmail.com', [Validators.required, Validators.email]],
      password: ['123456', Validators.required],

    })

    this.uiSubscription = this.store.select('ui')
      .subscribe( ui => {
        this.cargando = ui.isLoading
        console.log('cargando subs')
      })
  }

  ngOnInit(): void {


  }

  ngOnDestroy() {
    this.uiSubscription.unsubscribe()
  }

  crearUsuario() {

    if( this.registroForm.invalid ) { return; }

    this.store.dispatch( ui.isLoading() )

    const { nombre, correo, password } = this.registroForm.value;
    this.authService.crearUsuario(nombre, correo, password)
      .then( credenciales => {
        console.log(credenciales);
        this.store.dispatch(ui.stopLoading());
        this.router.navigate(['/']);
      })
      .catch( err => {
        //console.error('miErr', err)
        this.store.dispatch(ui.stopLoading());
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,

        })
      })
  }

}
