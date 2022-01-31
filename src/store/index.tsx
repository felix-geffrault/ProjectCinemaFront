import {configureStore} from "@reduxjs/toolkit";
import panelReducer from "../components/Panel/panelReducer";
import {apiSlice} from "../api/api";
import youtubeReducer from "../components/YouTube/youtubeReducer";
import movieReducer from "../components/DashBoard/movieReducer";
import authReducer from "../components/Panel/ConfigurePanel/LoginPanel/authSlice";

const store = configureStore({
    reducer: {
        movies: movieReducer,
        panel: panelReducer,
        youtube: youtubeReducer,
        auth: authReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware)
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;