import {createAction, props} from '@ngrx/store';
import {IngresoEgreso} from "../models/ingreso-egreso.model";

export const setItems = createAction(
  '[IngresoEgreso] set Items',
  props<{items: IngresoEgreso[]}>()
  );

export const unSetItems = createAction('[IngresoEgreso] unSet Items');
