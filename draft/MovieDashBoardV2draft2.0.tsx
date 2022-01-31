import React, {useEffect, useMemo, useRef, useState} from "react";
import {DashBoardMovie, PlacedDashBoardMovie} from "../../models/Movie";
import {getMovieDashboard} from "../../api/MovieService";
import './MovieDashBoardV2.css'
import {shuffle} from "../../utils";
import {useDrag} from "@use-gesture/react";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {Link} from "react-router-dom";
import {displayMovie} from "../Panel/panelReducer";
import {useGetMoviesQuery} from "../../api/api";
import {useSpring, useTransition, a, animated} from "@react-spring/web";
import {angle, angleReversed, h, hI, nbRows, w, wI, xVectors, xyVectors, yVectors} from "./consts";
import {
    handleColumnsShiftLeft,
    handleColumnsShiftRight,
    handleRowsShiftDown,
    handleRowsShiftUp,
    setMovies
} from "./movieReducer";
import store from "../../store";
import {MovieLink} from "../src/components/MovieLink/MovieLink";


interface DraggedDashBoardMovie extends PlacedDashBoardMovie{
    ox: number,
    oy: number,
}



export const MovieDashBoardV2 : React.FC = () => {
    const { data, error, isLoading, isSuccess } = useGetMoviesQuery<{data: DashBoardMovie[], error: string, isLoading: boolean, isSuccess: boolean}>();
    const [rows, shift] = useAppSelector<[PlacedDashBoardMovie[][], {x: number, y: number}]>(state => ([state.movies.rows, state.movies.shift]));
    /*const [rows, setRows] = useState<DashBoardMovie[][]>([]);
    const [shift, setShift] = useState<{x: number, y: number}>({x: 0, y: 0})*/
    const dashboard = useRef<HTMLDivElement>(null);
    const isPanelOpen = useAppSelector(state => state.panel.isOpen);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(data) dispatch(setMovies(data));
    }, [data])

    const movies : PlacedDashBoardMovie[] = useMemo( () => {
        if(!rows.length) return [];
        const movies: PlacedDashBoardMovie[] =  rows.reduce((a, b) => a.concat(b))
        movies.sort((a, b) => a.id - b.id)
        return movies;
    }, [rows])

    const [boardStyles, api] = useSpring(() => ({ x: 0, y: 0, scale: 1,}), )

    const bind = useDrag(({ down, offset: [x, y] }) => {
        api.start({x, y})
        const x2 = Math.cos(angle) * x - Math.sin(angle)*y;
        const y2 = Math.sin(angle) * x + Math.cos(angle) * y;
        if(x2 > w*(shift.x+1)) dispatch(handleColumnsShiftRight());
        else if (x2 < w*(shift.x-1)) dispatch(handleColumnsShiftLeft());
        else if  (y2 > h*(shift.y+1)) dispatch(handleRowsShiftDown());
        else if (y2 < h * (shift.y - 1)) dispatch(handleRowsShiftUp())
    }, {filterTaps: true});


    const transitions = useTransition(movies, {
        key: (movie: PlacedDashBoardMovie) => movie.id,
        from: ({ x, y }) => ({ x, y,  opacity: 0, rotate: -30 }),
        enter: ({ x, y }) => ({ x, y, opacity: 1 }),
        update: ({ x, y }) => ({ x , y }),
        leave: { opacity: 0 },
        immediate: true,
        config: { mass: 0, tension: 0, friction: 0 },
        trail: 0,
    })


    return<animated.div className="movie-dashboard" ref={dashboard} {...bind()} style={boardStyles}>
        {transitions( (style, movie)  =>
            <a.div className="movie-poster" style={style}>
                <Link to={`/movie/${movie.id}`} onClick={() => dispatch(displayMovie(movie))} draggable={false}>
                    <div className="movie-poster-title">
                        <p>{movie.title}</p>
                    </div>
                    <img className="movie-poster-img" src={movie.posterUrl} alt={`${movie.title} poster`} height={hI} width={wI}/>
                </Link>
            </a.div>)}
    </animated.div>
}


if(movie.id !== -1){
    const moviePlaced = movie as PlacedDashBoardMovie;
    return <div className="movie-poster" style={posterStyle} >
        <MovieLink movie={moviePlaced} draggable={false} onLoad={() => setIsImgLoaded(true)}>
            <div className="movie-poster-title">
                <p>{moviePlaced.title}</p>
            </div>
            <img className="movie-poster-img" src={moviePlaced.posterUrl} alt={`${moviePlaced.title} poster`} height={hI} width={wI} ref={imgRef} style={imgStyle}/>
        </MovieLink>
    </div>
}
return <></>


const [posterStyle, setPosterStyle] = useState<React.CSSProperties>({});

useEffect(() => {
    if(movie){
        const newPosterStyle : React.CSSProperties = {transform: `translate3d(${movie.x}px, ${movie.y}px, 0) rotate(-30deg)`};
        if(movie.id == 14) console.log(selectedPos, posterStyle)
        if(selectedPos !== -1) newPosterStyle.zIndex = 10;
        else if(selectedPos === -1 && posterStyle.zIndex === 10){
            newPosterStyle.zIndex = 9;
        }
        setPosterStyle(newPosterStyle);
    }

}, [movie.x, movie.y, selectedMovies])