import React, {useCallback, useEffect, useRef, useState} from "react";
import './MovieDashBoardV2.css'
import {useDrag} from "@use-gesture/react";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {useGetMoviesQuery} from "../../api/api";
import {useSpring, animated} from "@react-spring/web";
import {angle, hI, wI} from "./consts";
import {handleMove, selectMovieById, setMovies} from "./movieReducer";
import {MovieLink} from "../MovieLink/MovieLink";
import {useGetActiveCategoriesNames} from "../../hooks/CategoryHooks";


type Position = {
    x: number,
    y: number
}


const Movie : React.FC<{id: number, handleGetBoardPos: () => Position}> = ({id, handleGetBoardPos}) => {
    const movie = useAppSelector(state => selectMovieById(state, id))!;
    const selectedMovies =  useAppSelector(state => state.panel.movies);
    const [isImgLoaded, setIsImgLoaded] = useState(false);
    const [imgStyle, setImgStyle] = useState<React.CSSProperties>({});
    const selectedPos = movie && selectedMovies.length ? selectedMovies.map(m => m.id).indexOf(movie.id) : -1;
    const ref = useRef<HTMLDivElement>(null);

    const posterStyle : React.CSSProperties =  movie ? {
        transform: `translate3d(${movie.x}px, ${movie.y}px, 0) rotate(-30deg)`,
        opacity: isImgLoaded ? 1 : 0
    } : {}
    if(selectedPos !== -1 ) posterStyle.zIndex = 10;


    const imgRef = useCallback(node => {
        if (node === null || selectedPos === -1){
            setImgStyle({})
            return;
        }
        const {x: xBoard, y: yBoard} = handleGetBoardPos();
        const [x, y] = [movie.x + xBoard, yBoard + movie.y];
        const windowWidth = window.innerWidth;
        const coefWidth = windowWidth > 993 ? (windowWidth * 0.4 > 550 ? 0.6 : (windowWidth-550)/windowWidth) : 1;
        const windowWidthFinal = windowWidth * coefWidth;
        const yTarget = window.innerHeight/2-hI/2;
        const xTarget = windowWidthFinal*(selectedPos+1)/(selectedMovies.length+1)-wI/2;
        const scale = Math.min(windowWidthFinal/(selectedMovies.length+1) / (wI+15), 2);
        const [xMove, yMove] = [xTarget-x, yTarget-y];
        const [xMove2, yMove2] = [Math.cos(-angle) * xMove + Math.sin(-angle) * yMove, - Math.sin(-angle) * xMove + Math.cos(-angle) * yMove];
        setImgStyle({transform: `translate3d(${xMove2}px, ${yMove2}px, 0) rotate(30deg) scale(${scale})`, zIndex: 2});
    }, [selectedMovies, isImgLoaded])

    return movie ? <div className="movie-poster" style={posterStyle} ref={ref} >
        <MovieLink movie={movie} draggable={false} >
            <div className="movie-poster-title">
                <p>{movie.title}</p>
            </div>
            <img className="movie-poster-img" src={movie.posterUrl} alt={`${movie.title} poster`} height={hI} width={wI} ref={imgRef} style={imgStyle} onLoad={() => setIsImgLoaded(true)}/>
        </MovieLink>
    </div> : <></>
}



export const MovieDashBoardV2 : React.FC = () => {
    const activeCategoriesNames = useGetActiveCategoriesNames();
    const { data, error, isLoading, isSuccess } = useGetMoviesQuery<{data: {id: number}[], error: string, isLoading: boolean, isSuccess: boolean}>(activeCategoriesNames);
    /*const shift = useAppSelector(state => state.movies.shift);*/
    const copies = useAppSelector(state => state.movies.copies);
    const dashboard = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();

    const [boardStyles, api] = useSpring(() => ({ x: 0, y: 0}));
    const [grabStyles, apiGrab] = useSpring(() => ({ x: 0, y: 0}));
    if(error){
        console.log(error);
    }

    useEffect(() => {
        if(data) dispatch(setMovies(data));
    }, [data])

    const handleGetBoardPos = (): Position => {
        return {x: boardStyles.x.get(), y: boardStyles.y.get()}
    }

    const bind = useDrag(({ down, offset: [x, y] }) => {
        api.start({x, y});
        apiGrab.start({x: -x,y: -y});
        const x2 = Math.cos(angle) * x - Math.sin(angle)*y;
        const y2 = Math.sin(angle) * x + Math.cos(angle) * y;
        dispatch(handleMove({x2, y2}));
    }, {filterTaps: true});



    return<animated.div className="movie-dashboard" ref={dashboard} {...bind()} style={boardStyles}>
        <animated.div className={"movie-dashboard-grabable"} style={grabStyles}/>
        {data ? data.map(movie => <Movie id={movie.id} key={movie.id} handleGetBoardPos={handleGetBoardPos}/>) : ''}
        {copies ? copies.map(movie => <Movie id={movie.id} key={movie.id} handleGetBoardPos={handleGetBoardPos}/>) : ''}
    </animated.div>
}