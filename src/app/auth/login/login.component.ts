import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    })
  }

  ngOnInit(): void {

  }

  login() {

    if( this.loginForm.invalid ) { return; }

    const { correo, password } = this.loginForm.value;
    this.authService.loginUsuario(correo, password)
      .then( credenciales => {
        console.log('mis',credenciales);
        this.router.navigate(['/']);
      }).catch( err => {
      //console.error('miErr', err)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message,

      })
    })
  }

}
