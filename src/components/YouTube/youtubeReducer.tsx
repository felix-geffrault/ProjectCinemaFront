import {createSlice} from "@reduxjs/toolkit";

interface YouTubeState {
    videoURL?: string,
    isOpen: boolean
}

const initialState: YouTubeState = {
    isOpen: false,
}


const youtubeReducer = createSlice({
    name: 'youtube',
    initialState,
    reducers: {
        setVideo(state, action){
            state.videoURL = action.payload;
        },
        toggleOpen(state) {
            state.isOpen = !state.isOpen
        }
    }
})

export const {setVideo, toggleOpen} = youtubeReducer.actions;

export default youtubeReducer.reducer;