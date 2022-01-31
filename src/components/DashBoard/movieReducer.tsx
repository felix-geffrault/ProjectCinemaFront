import {createSelector, createSlice} from "@reduxjs/toolkit";
import {PlacedDashBoardMovie} from "../../models/Movie";
import {Category} from "../../models/Category";
import {angle, angleReversed, h, nbPostersShown, nbRows, w, xVectors, yVectors} from "./consts";
import {RootState} from "../../store";

interface MovieState {
    rows: PlacedDashBoardMovie[][],
    shift: {x: number, y: number},
    selectedIds: number[],
    categories?: Category[],
    copies?: PlacedDashBoardMovie[],
}

const initialState: MovieState = {
    rows: [],
    shift: {x: 0, y: 0},
    selectedIds: [],
}

/*// First, create the thunk
const fetchUserById = createAsyncThunk(
    'movie/fetchMovies',
    async (userId, thunkAPI) => {
        const response = await userAPI.fetchById(userId)
        return response.data
    }
)*/

const movieReducer = createSlice({
    name: 'movies',
    initialState,
    reducers: {
        setMovies(state, action){
            let movies = [...action.payload]
            const nbMovies = movies.length;
            if(nbMovies && nbMovies < nbPostersShown){
                let i = 0;
                const iMax = movies.length;
                let totalIter = 0;
                const copies = [];
                while(movies.length < nbPostersShown){
                    const copyId = movies[i].id+100_000+10_000*totalIter;
                    const newMovie = {...movies[i], id:copyId}
                    movies.push(newMovie);
                    i++;
                    copies.push(newMovie)
                    if(i === iMax){
                        i = 0;
                        totalIter++;
                    }
                }
                state.copies = copies;
            }
            const windowXCenter = window.innerWidth / 2;
            const windowYCenter = window.innerHeight / 2;
            const middleH = - h * nbRows / 2;
            const middleW = w * Math.floor(movies.length / nbRows) / 2;
            const xCenter = middleH * Math.cos(angleReversed) - middleW * Math.cos(angle) + windowXCenter;
            const yCenter = middleH * Math.sin(angleReversed) + middleW * Math.sin(angle) + windowYCenter;
            const valueShiftX = -xVectors.w * state.shift.x - xVectors.h * state.shift.y;
            const valueShiftY = -yVectors.w * state.shift.x - yVectors.h * state.shift.y;
            const rows = new Array(nbRows); //Array referencing the movies in rows
            for(let i=0; i < nbRows; i++){
                rows[i] = [];
            }
            movies.forEach((movie: PlacedDashBoardMovie, i: number) => {
                const rowIndex = i % nbRows;
                const columnIndex = Math.floor(i / nbRows);
                const indent = -w / 2 * (rowIndex % 2);
                const newMovie = {...movie}
                newMovie.x = columnIndex * w * Math.cos(angle) + rowIndex * h * Math.cos(angleReversed) + indent * Math.cos(angle) + xCenter + valueShiftX; // Rotationate pos + center
                newMovie.y = rowIndex * h * Math.sin(angleReversed) - columnIndex * w * Math.sin(angle) - indent * Math.sin(angle) + yCenter + valueShiftY;
                rows[rowIndex].push(newMovie);
            });
            state.rows = rows;
        },
        setSelectedMoviesIds(state, action){
            state.selectedIds = action.payload;
        },
        handleMove(state, action){
            const {x2, y2} = action.payload;
            if(x2 > w*(state.shift.x+1)) {
                state.rows = state.rows.map(row => {
                    const movie = row.pop()!;
                    movie.x -= (row.length+1) * xVectors.w;
                    movie.y -= (row.length+1) * yVectors.w;
                    row.unshift(movie);
                    return row;
                })
                state.shift.x += 1;
            }
            else if (x2 < w*(state.shift.x-1)){
                state.rows = state.rows.map(row => {
                    const newMovie = row.shift()!;
                    newMovie.x += (row.length+1) * xVectors.w;
                    newMovie.y += (row.length+1) * yVectors.w;
                    row.push(newMovie);
                    return row;
                });
                state.shift.x -= 1
            }
            else if  (y2 > h*(state.shift.y+1)) {
                const row = state.rows.pop()!;
                row.forEach(movie => {
                    movie.x -= nbRows * xVectors.h;
                    movie.y -= nbRows * yVectors.h;
                })
                state.rows.unshift(row);
                state.shift.y += 1;
            }
            else if (y2 < h * (state.shift.y - 1)) {
                const row = state.rows.shift()!;
                row.forEach(movie => {
                    movie.x += nbRows * xVectors.h;
                    movie.y += nbRows * yVectors.h;
                })
                state.rows.push(row);
                state.shift.y -= 1;
            };
        },
    },
});

export const selectAllMovies = (state: RootState) => state.movies.rows.reduce((a, b) => a.concat(b), []);

const selectAllSelectedIds = (state: RootState) => state.movies.selectedIds;

export const selectSelectedIds = createSelector(
    [selectAllSelectedIds, (state, movieId) => movieId],
    (selectedIds, movieId) => (selectedIds.includes(movieId) ? selectedIds : [])
)

export const selectMovieById = createSelector(
    [selectAllMovies, (state, movieId) => movieId],
    (movies, movieId) => movies.find(movie => movie.id === movieId) /*|| {x: 0, y: 0, id: -1}*/
)

export const {setMovies, setSelectedMoviesIds, handleMove} = movieReducer.actions;

export default movieReducer.reducer;