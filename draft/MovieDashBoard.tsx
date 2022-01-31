import React, {useEffect, useRef, useState} from "react";
import {DashBoardMovie} from "../src/models/Movie";
import {getMovieDashboard} from "../src/api/MovieService";
import './MovieDashboard.css'
import {shuffle} from "../src/utils";
import {useDrag} from "@use-gesture/react";
import {useAppDispatch, useAppSelector} from "../src/store/hooks";
import {Link} from "react-router-dom";
import {displayMovie} from "../src/components/Panel/panelReducer";

const MoviePoster: React.FC<{movie: DashBoardMovie}> = ({movie}) => {
    const selectedMovie = useAppSelector(state => state.panel.entity!)
    const dispatch = useAppDispatch();
    const ref = useRef<HTMLAnchorElement>(null);
    const [style, setStyle] = useState({});
    const path = `/movie/${movie.id}`;

    useEffect(() => {
        if(selectedMovie && selectedMovie.id === movie.id && ref.current){
            const width = ref.current!.clientWidth;
            const height = ref.current!.clientHeight;
            const {left, top} = ref.current!.getBoundingClientRect();
            const [xTarget, yTarget] = [window.innerWidth*0.6/2 - width, window.innerHeight/2 - height/2]
            const [translateX, translateY] = [xTarget-left, yTarget - top]
            setStyle({
                transform: `rotate(30deg) translate3d(${translateX}px, ${translateY}px, 0) scale(2)`,
                zIndex: 10,
            });
            document.querySelectorAll<HTMLElement>('.movie-dashboard-row').forEach(row => row.style.zIndex = "0");
            ref.current!.parentElement!.style.zIndex = "1";
            /*const newImg = document.createElement('img');
            newImg.setAttribute('src', movie.posterUrl);
            newImg.style.position = 'absolute';
            newImg.style.left = window.innerWidth*0.6/2 - 190/2 +'px'; //190 * 281
            newImg.style.top = window.innerHeight/2 - 281/2 + 'px';
            newImg.style.transform = `scale(2) translate(0, 0)`
            document.querySelector('.App')!.append(newImg);*/
        }else if(style !== {}) setStyle({});
    }, [selectedMovie]);

    return <Link to={path} onClick={() => dispatch(displayMovie(movie))} className={"movie-poster "} draggable={false} ref={ref} onLoad={() => {
        const node = ref.current!;
        const waitingTime: number = Math.random()*4;
        setTimeout( () => {
            node.style.opacity = "1";
        },waitingTime*1000)}
    }>
        <div className="movie-poster-title">
            <p >{movie.title}</p>
        </div>
        <img className="movie-poster-img" src={movie.posterUrl} alt={`${movie.title} poster`} style={style} />
    </Link>
}


const DashBoardLine: React.FC<{movies: DashBoardMovie[]}> = ({movies}) =>{
    return <div className="movie-dashboard-row">
        {movies.map((movie, index) => {
            return <MoviePoster movie={movie} key={index} />
        })}
    </div>
}


export const MovieDashBoard : React.FC = () => {
    const [rows, setRows] = useState<DashBoardMovie[][]>([]);
    const [shift, setShift] = useState<{x: number, y: number}>({x: 0, y: 0})
    const dashboard = useRef<HTMLDivElement>(null);
    const isPanelOpen = useAppSelector(state => state.panel.isOpen);

    const posterWidth = (148.75+15); // /!\ memoized when responsive ? 15 = margin
    const posterHeight = (220+15);

    const drag = useDrag(({ tap, offset: [ox, oy]}) => {
        if(tap) return
        const dash = dashboard.current!;
/*
        const moviePoster = dash.querySelectorAll('.movie-poster')[0];
        const {width, height} = moviePoster.getBoundingClientRect(); //Add the margin left
*/
        let shiftDiffX = ox - shift.x;
        let shiftDiffY = oy - shift.y;
        const angle = 30*Math.PI/180;
        const offSetXNormalized = shiftDiffX * Math.cos(angle) + shiftDiffY * Math.sin(angle);
        const offSetYNormalized = shiftDiffX * Math.cos(90 * Math.PI / 180 - angle) + shiftDiffY * Math.sin(90 * Math.PI / 180 - angle)
        if( offSetXNormalized > 2 * posterWidth){ //Shift of 2 poster on left
            const newShiftX = shift.x + 2 * Math.cos(angle) * posterWidth;
            const newShiftY = shift.y - 2 * Math.sin(angle) * posterWidth;
            shiftDiffX = ox - newShiftX;
            shiftDiffY = oy - newShiftY;
            setShift({x: newShiftX, y: newShiftY})
            document.querySelectorAll('.movie-dashboard-row').forEach( row => {
                row.insertBefore(row.lastChild!, row!.firstChild);
                row.insertBefore(row.lastChild!, row!.firstChild);
            })
            console.log("left shift done")
        }else if( offSetXNormalized < -2 * posterWidth){
            const newShiftX = shift.x - Math.cos(angle) * posterWidth;
            const newShiftY = shift.y + Math.sin(angle) * posterWidth;
            shiftDiffX = ox - newShiftX;
            shiftDiffY = oy - newShiftY;
            setShift({x: newShiftX, y: newShiftY})
            document.querySelectorAll('.movie-dashboard-row').forEach( row => {
                row!.append(row.firstChild!);
            })
            console.log("rght shift done")
        }else if(offSetYNormalized < -2 * posterHeight ) {
            const newShiftX = shift.x - 2 * posterHeight * Math.cos(90 * Math.PI / 180 - angle) /*- Math.cos(angle) * 90*/;
            const newShiftY = shift.y - 2 * posterHeight * Math.sin(90 * Math.PI / 180 - angle) /*+ Math.sin(angle) * 90*/;
            shiftDiffX = ox - newShiftX;
            shiftDiffY = oy - newShiftY;
            setShift({x: newShiftX, y: newShiftY})
            dash.append(dash.firstChild!)
            dash.append(dash.firstChild!)
            console.log("bottom shift done")
        }else if(offSetYNormalized > 2 * posterHeight){
            const newShiftX = shift.x + 2 * posterHeight * Math.cos(90*Math.PI/180 - angle) /*- Math.cos(angle) * 90*/;
            const newShiftY = shift.y + 2 * posterHeight * Math.sin(90*Math.PI/180 - angle) /*+ Math.sin(angle) * 90*/;
            shiftDiffX = ox - newShiftX;
            shiftDiffY = oy - newShiftY;
            setShift({x: newShiftX, y: newShiftY})
            dash.insertBefore(dash.lastChild!, dash.firstChild!)
            dash.insertBefore(dash.lastChild!, dash.firstChild!)
            console.log("top shift done")
        }
        const offsetX = -dash.clientWidth/2 + shiftDiffX;
        let offsetY = -dash.clientHeight/2 + shiftDiffY ;
        console.log('offsetY', offsetY, "shiftDiiffy", shiftDiffY, "oy", oy, "offNorm", offSetYNormalized)
        console.log('offsetX', offsetX, "shiftDiiffX", shiftDiffX, "ox", ox, "offNorm", offSetXNormalized)
        dashboard.current!.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) rotate(-30deg)`;
        }, {filterTaps: true}
    )


    useEffect(() => {
        const getMovies = async () => {
            await getMovieDashboard().then(movieCollection => {
                let movieList: DashBoardMovie[] = movieCollection._embedded.movies;
                movieList = shuffle(movieList);
                const nbLines: number = 8;
                const moviesPerLine: number = Math.floor(movieList.length / nbLines);
                const newRows: DashBoardMovie[][] = [];
                for(let i = 0 ; i < nbLines ; i++){
                    const nextRow: DashBoardMovie[] = movieList.slice(i*moviesPerLine, moviesPerLine*(i+1));
                    newRows.push(nextRow);
                }
                for( let i = 0 ; i < movieList.length - nbLines*moviesPerLine; i++){
                    const movieIndex = nbLines*moviesPerLine + i;
                    newRows[i].push(movieList[movieIndex]);
                }
                setRows(newRows);
            });
        }
        if(rows.length === 0) getMovies()
    }, [rows])

    return <div className={`movie-dashboard-wrapper${isPanelOpen ? "" : " large"}`}>
        <div className="movie-dashboard" ref={dashboard} {...drag()} >
            {rows?.map((movieRow, index) => {
                return <DashBoardLine movies={movieRow} key={index} />
            })}
        </div>
    </div>
}