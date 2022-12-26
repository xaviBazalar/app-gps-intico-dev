import { createReducer, on, Action, State } from '@ngrx/store';
import { addTareas, successTarea, errorTarea } from './tareas.actions';

export interface TareasState {
    tareas: any,
    loaded: boolean,
    loading: boolean,
    error: any

}

export const tareasInitialState: TareasState = {
    tareas: [],
    loaded: false,
    loading: false,
    error: {
        url:"",
        name:"",
        message:""
    }
};

const _tareaReducer = createReducer(tareasInitialState,
    on(addTareas, state => ({
         ...state, 
         loading: true })),
    on(successTarea, (state, { data }) => ({ 
        ...state, 
        loading: false ,
        loaded:true,
        tareas:[...data]
    })),
    on(errorTarea, (state, { payload }) => ({ 
        ...state, 
        loading: false ,
        loaded:false,
        error:{
            url:payload?.url,
            name:payload?.name,
            message:payload?.message
        }
    }))
)

export function tareaReducer(state, action) {
    return _tareaReducer(state,action)
}