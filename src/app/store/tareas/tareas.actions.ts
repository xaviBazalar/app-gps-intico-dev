import { createAction, props } from '@ngrx/store';

export const addTareas = createAction('[Tarea] addTareas',props<{id:any}>());
export const addTareasNew = createAction('[Tarea] addTareasNew',props<{data:any}>());
export const successTarea = createAction('[Tarea] successTarea',props<{data:any}>());
export const successTareaNew = createAction('[Tarea] successTareaNew',props<{data:any}>());
export const errorTarea = createAction('[Tarea] successTarea',props<{payload:any}>());
