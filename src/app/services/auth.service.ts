import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {map, Subscription} from "rxjs";
import {Usuario} from "../models/usuario.model";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AppState} from "../app.reducer";
import {Store} from "@ngrx/store";
import * as authActions from "../auth/auth.actions";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;
  private _user: Usuario | null;

  get user(): Usuario | null {
    return this._user;
  }

  constructor(public auth: AngularFireAuth,
              private firestore: AngularFirestore,
              private store: Store<AppState>,
              ) { }

  initAuthListener() {
    this.auth.authState.subscribe( fuser => {
      // console.log('fuser', fuser?.uid);
      // console.log('fuser', fuser?.email)
      if( fuser ) {
        this.userSubscription = this.firestore.doc(`${ fuser.uid }/usuario`).valueChanges()
                                .subscribe( firestoreUser => {

                                  const user = Usuario.fromFirebase(firestoreUser);

                                  this._user = user;

                                  // console.log('firestoreUser: ', firestoreUser)
                                  this.store.dispatch( authActions.setUser({user: user}) )
                                })
      } else {
        // console.log('llamar unset del user')
        this._user = null;
        this.userSubscription.unsubscribe();
        this.store.dispatch( authActions.unSetUser());
      }

      // this.store.dispatch( authActions.setUser({user: fuser}) )

    })
  }

  crearUsuario(nombre: string, email: string, password: string) {
    // console.log({nombre, email, password});
    return this.auth.createUserWithEmailAndPassword(email, password)
      .then( ({user}) => {
        // @ts-ignore
        const newUser = new Usuario( user.uid, nombre, user.email);
        return this.firestore.doc(`${user?.uid}/usuario`).set({...newUser});
      });

  }

  loginUsuario( email:string, password: string) {
    return this.auth.signInWithEmailAndPassword(email,password);
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(
      map(fbUser => fbUser != null)
    )
  }
}
