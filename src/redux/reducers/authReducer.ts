import { createSlice } from "@reduxjs/toolkit";
import { localDataNames } from "../../constants/appInfos";

export interface AuthState {
    token: string,
    _id: string,
    rule: number
}

const initialState = {
    token: '',
    _id: '',
    name: '',
    rule: 0
}

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        data: initialState
    },
    reducers: {
        addAuth: (state, action) => {
            state.data = action.payload
            // syncLocal(action.payload) // when to check isRemember => save in localStorage
        },
        removeAuth: (state, _action) => {
            state.data = initialState
            syncLocal({})
        }
    }
})

export const authReducer = authSlice.reducer
export const { addAuth, removeAuth } = authSlice.actions
export const authSelector = (state: any) => state.authReducer.data

const syncLocal = (data: any) => {
    localStorage.setItem(localDataNames.authData, JSON.stringify(data))
}