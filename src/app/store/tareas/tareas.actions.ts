import { createAction, props } from '@ngrx/store';

export const addTareas = createAction('[Tarea] addTareas',props<{id:any}>());
export const successTarea = createAction('[Tarea] successTarea',props<{data:any}>());
export const errorTarea = createAction('[Tarea] successTarea',props<{payload:any}>());
