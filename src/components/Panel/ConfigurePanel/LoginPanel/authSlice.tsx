import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type AuthState = {
    token: string | null
    isAuth: boolean
}

const slice = createSlice({
    name: 'auth',
    initialState: { token: null, isAuth: false} as AuthState,
    reducers: {
        setCredentials: (state, { payload: { token } }: PayloadAction<{ token: string }>) => {
            state.token = token;
            state.isAuth = true;
        },
    },
})

export const { setCredentials } = slice.actions

export default slice.reducer

