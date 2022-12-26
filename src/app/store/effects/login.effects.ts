import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from "@ngrx/effects";

import * as LoginActions from '../actions'
import { catchError, mergeMap, tap } from 'rxjs/operators'
import { map, of, EMPTY } from 'rxjs';
import { LoginService } from '../../services/login.service';

@Injectable()
export class LoginEffects {

    constructor(
        private actions$: Actions,
        private loginService: LoginService
    ) {
    }

    cargarLogin$ = createEffect(() => this.actions$.pipe(
        ofType(LoginActions.validateLogin),
        //tap(data=>console.log("effect tap")),
        mergeMap(
            (action: any) => this.loginService.validateLogin(action.user,action.pass)
                .pipe(
                    //tap(data=>console.log("effect validateLogin tap",data)),
                    map((login: any) => LoginActions.successLogin({ data: login.usuario })),
                    catchError(err => of(LoginActions.errorLogin({ payload: err })))
                ))
    )
    );



}