import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "../app.reducer";
import {logEvent} from "@angular/fire/analytics";
import {filter, Subscription} from "rxjs";
import {IngresoEgresoService} from "../services/ingreso-egreso.service";
import * as ingresoEgresoActions from "../ingreso-egreso/ingreso-egreso.actions";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubs: Subscription;
  ingresosSubs: Subscription;

  constructor( private store: Store<AppState>,
               private ingresoEgresoService: IngresoEgresoService) { }


  ngOnInit(): void {
    this.userSubs = this.store.select('user')
      .pipe(
        filter( auth => auth.user != null )
      ).
    subscribe( ({user}) => {
      // console.log(user);
      // @ts-ignore
        this.ingresosSubs = this.ingresoEgresoService.initIngresosEgresosListener(user.user.uid)
          .subscribe( ingresosEgresosFB => {
            // console.log(ingresosEgresosFB)
            this.store.dispatch( ingresoEgresoActions.setItems({items: ingresosEgresosFB}) );

          })
    })
  }

  ngOnDestroy(): void {
      this.ingresosSubs?.unsubscribe();
      this.userSubs?.unsubscribe();
    }
}
