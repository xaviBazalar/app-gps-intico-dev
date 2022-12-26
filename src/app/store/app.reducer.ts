import { ActionReducerMap } from '@ngrx/store'
import * as reducers from './tareas'
import * as storeReducers from './reducers/login.reducers'

export interface AppState{
    tareas:reducers.TareasState,
    login:storeReducers.LoginState
}

export const appReducers:ActionReducerMap<AppState>={
    tareas:reducers.tareaReducer,
    login:storeReducers.loginReducer
}