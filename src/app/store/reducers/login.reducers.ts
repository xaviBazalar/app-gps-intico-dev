import { createReducer, on, Action, State, createSelector } from '@ngrx/store';
import { validateLogin,successLogin,errorLogin,getLogin } from '../actions/login.actions';

export interface LoginState {
    dataLogin: any,
    loaded: boolean,
    loading: boolean,
    error: any

}

export const loginInitialState: LoginState = {
    dataLogin: [],
    loaded: false,
    loading: false,
    error: {
        url:"",
        name:"",
        message:""
    }
};

export const selectLogin = (state: LoginState) => state.dataLogin;

export const selectVisibleLogin = createSelector(
    selectLogin,
    (selectedLogin: []) => {
        return selectedLogin;
    }
);

const _loginReducer = createReducer(loginInitialState,
    on(validateLogin, state => ({
         ...state, 
         loading: true })),
    on(successLogin, (state, { data }) => ({ 
        ...state, 
        loading: false ,
        loaded:true,
        dataLogin:[...data]
    })),
    on(errorLogin, (state, { payload }) => ({ 
        ...state, 
        loading: false ,
        loaded:false,
        error:{
            url:payload?.url,
            name:payload?.name,
            message:payload?.message
        }
    })),
    on(getLogin, state => ({
        ...state })),
)

export function loginReducer(state, action) {
    return _loginReducer(state,action)
}