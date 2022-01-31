import {createSlice} from "@reduxjs/toolkit";
import {DashBoardMovie} from "../../models/Movie";
import {Director} from "../../models/Director";
import {Actor} from "../../models/Actor";
import {Category} from "../../models/Category";

interface PanelState {
    value: string,
    isOpen: boolean,
    isEditing: boolean,
    entity?: DashBoardMovie | Director | Actor,
    categories?: Category[],
    movies: DashBoardMovie[],
}

const initialState: PanelState = {
    value: 'main',
    isOpen: true,
    isEditing: false,
    movies: []
}


const panelReducer = createSlice({
    name: 'panel',
    initialState,
    reducers: {
        displayMain(state){
            state.value = 'main';
            state.entity = undefined;
            state.movies = [];
        },
        displayMovie(state, action){
            state.value = 'movie';
            state.entity = action.payload;
            state.isOpen = true;
            state.movies = [action.payload];
        },
        displayActor(state, action){
            const actor: Actor = action.payload
            state.value = 'actor';
            state.entity = actor;
            if(actor.personages) state.movies = actor.personages.map(p => p.movie);
            state.isOpen = true;
        },
        displayConfigure(state, action){

        },
        togglePanel(state){
            state.isOpen = !state.isOpen;
        },
        toggleEditing(state){
            state.isEditing = !state.isEditing;
        }
    },
});

export const {displayMovie, displayActor, togglePanel, displayMain} = panelReducer.actions;

export default panelReducer.reducer;