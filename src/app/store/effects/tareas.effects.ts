import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from "@ngrx/effects";

import * as TareasActions from '../tareas/tareas.actions'
import { catchError, mergeMap, switchMap, tap } from 'rxjs/operators'
import { TaskService } from '../../services/task.service';
import { map, of } from 'rxjs';

@Injectable()
export class TareasEffects {

    constructor(
        private actions$: Actions,
        private taskService: TaskService
    ) {
    }

    cargarTareas$ = createEffect(() => this.actions$.pipe(
        ofType(TareasActions.addTareas),
        //tap(data=>console.log("effect tap")),
        mergeMap(
            (action: any) => this.taskService.getTask(action.id, null, null)
                .pipe(
                    //tap(data=>console.log("effect getTask tap",data)),
                    map((tareas: any) => TareasActions.successTarea({ data: tareas.task })),
                    catchError(err => of(TareasActions.errorTarea({ payload: err })))
                ))
    )
    );

    cargarTareaNueva$ = createEffect(() => this.actions$.pipe(
        ofType(TareasActions.addTareasNew),
        //tap(data=>console.log("effect tap")),
        mergeMap(
            (action: any) => this.taskService.postTask(action.data)
                .pipe(
                    tap(data=>console.log("effect postTask tap",data)),
                    map((tareas: any) =>TareasActions.successTareaNew({ data: tareas })),
                    catchError(err => of(TareasActions.errorTarea({ payload: err })))
                ))
    )
    );



}