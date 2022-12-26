import { createAction, props } from '@ngrx/store';

export const getLogin = createAction('[Login] getLogin');
export const validateLogin = createAction('[Login] validateLogin',props<{user:any,pass:any}>());
export const successLogin = createAction('[Login] successLogin',props<{data:any}>());
export const errorLogin= createAction('[Login] errorLogin',props<{payload:any}>());
