import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  registroForm: FormGroup;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router) {
    this.registroForm = this.fb.group({
      nombre: ['claudio', Validators.required ],
      correo: ['claudio@gmail.com', [Validators.required, Validators.email]],
      password: ['123456', Validators.required],

    })
  }

  ngOnInit(): void {


  }

  crearUsuario() {

    if( this.registroForm.invalid ) { return; }

    const { nombre, correo, password } = this.registroForm.value;
    this.authService.crearUsuario(nombre, correo, password)
      .then( credenciales => {
        console.log(credenciales);
        this.router.navigate(['/']);
      })
      .catch( err => {
        //console.error('miErr', err)
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,

        })
      })
  }

}
