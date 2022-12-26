import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from "@ngrx/effects";

import * as TareasActions from '../tareas/tareas.actions'
import { catchError, mergeMap, tap } from 'rxjs/operators'
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



}