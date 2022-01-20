import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {AppState} from "../../app.reducer";
import {filter, Subscription} from "rxjs";
import * as ingresoEgresoActions from "../../ingreso-egreso/ingreso-egreso.actions";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  nombreUsuario: string;
  userSubs: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              private store: Store<AppState>)
  { }

  ngOnInit(): void {
    this.userSubs = this.store.select('user')
      .pipe(
        filter( auth => auth.user != null )
      ).
      subscribe( ({user}) => {
       // @ts-ignore
        this.nombreUsuario = user.user.nombre;
        // console.log(this.nombreUsuario)
      })
  }

  logout(){
    this.authService.logout().then( ()=> {
      this.router.navigate(['/login']);
    })
  }

}
