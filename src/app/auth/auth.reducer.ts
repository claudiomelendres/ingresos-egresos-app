import { createReducer, on } from '@ngrx/store';
import { setUser, unSetUser } from './auth.actions';
import {Usuario} from "../models/usuario.model";

export interface State {
  user: Usuario | unknown;
}

export const initialState:State = {
  user: null
};

const _authReducer = createReducer(
  initialState,
  on(setUser,   (state, user) => ({...state, user: { ...user} })),
  on(unSetUser, state=> ({ ...state, user:null}))
);

// @ts-ignore
export function authReducer(state, action) {
  return _authReducer(state, action);
}
