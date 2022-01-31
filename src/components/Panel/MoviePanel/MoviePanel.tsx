import React, {useEffect} from "react";
import {DashBoardMovie, Movie} from "../../../models/Movie";
import {Link, useParams} from "react-router-dom";
import {useGetMovieQuery} from "../../../api/api";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import {displayActor, displayMovie} from "../panelReducer";
import {Spinner} from "../../Spinner/Spinner";
import {setVideo, toggleOpen} from "../../YouTube/youtubeReducer";
import './MoviePanel.css';
import {CategoriesDisplay} from "../CategoriesDisplay/CategoriesDisplay";


export const MoviePanel: React.FC<{dashBoardMovie: DashBoardMovie | undefined, }> = ({dashBoardMovie}) => {
    const {id} = useParams<{id: string}>();
    const { data: movie, isFetching, isSuccess, isError, error } = useGetMovieQuery<{data: Movie, isFetching: boolean, isSuccess: boolean, isError: boolean, error: string}>((parseInt(id) > 100_000 ? parseInt(id) % 10_000 : id));
    const selectedMovies = useAppSelector(state => state.panel.movies);
    const dispatch = useAppDispatch();

    useEffect( () => {
        if(movie){
            dispatch(setVideo(movie.trailerUrl));
            if(selectedMovies.length !== 1 || selectedMovies[0].id !== parseInt(id)) dispatch(displayMovie(movie))
        }
    }, [movie]);

    let content;
    if(isFetching){
        content = (<>
                <h1>{(dashBoardMovie && dashBoardMovie.title) || "Loading ..."}</h1>
                <Spinner />
            </>
        )
    }else if(isSuccess){
        const yearAndDuration = new Date( movie.releaseYear +' '+ movie.duration);
        content = (<>
                <div className="movie-header">
                    <h1 className="movie-title">{movie.title}</h1>
                    <div className="movie-meta">
                        <p className="movie-duration">{yearAndDuration.getHours()}h{yearAndDuration.getMinutes() ? yearAndDuration.getMinutes() : ''}</p>
                        <p className="movie-year">{yearAndDuration.getFullYear()}</p>
                    </div>
                    <CategoriesDisplay categories={movie.categories} />
                </div>
                <div className="movie-imdbRate-wrapper">
                    <p className="movie-imdbRate">{movie.imdbRate}</p>
                    <svg height="80" width="80" className="rate-circle">
                        <circle cx="50%" cy="50%" r="35" stroke="#b6b6b6" strokeWidth="10" fillOpacity="0" strokeDasharray={(2*Math.PI)*movie.imdbRate/10*35 + ',' + (2*Math.PI)*35} strokeDashoffset={(2*Math.PI)*movie.imdbRate/10*35}/>
                    </svg>
                </div>
                <div className="field movie-description">
                    <h2 className="label movie-description-label">Description</h2>
                    <p className="description-text">{movie.description}</p>
                </div>
                <div className="field movie-director">
                    <h2 className="inline-label movie-director-label">Director</h2>
                    <a className="movie-director-name" href={movie.director.wikipediaUrl} rel="noreferrer"  target="_blank">{movie.director.fullName}</a>
                </div>
                <div className="field movie-personages">
                    <h2 className="label movie-personage-label">Personage</h2>
                    <div className="movie-personage-grid">
                        {movie.personages.map((personage, index) => {
                            return <div className="movie-personage" key={index}>
                                <div className="movie-personage-img-wrapper">
                                    <img src={personage.actor.photoUrl} alt={"Photo of " + personage.actor.fullName} />
                                </div>
                                <div className="movie-personage-infos">
                                    <p className="movie-personage-name">{personage.name}</p>
                                    <p className="movie-played-by">played by</p>
                                    <Link to={'/actor/' + personage.actor.id} className="movie-personage-actor-name" onClick={() => dispatch(displayActor(personage.actor))}>{personage.actor.fullName}</Link>
                                </div>
                            </div>
                        })}
                        <div className="movie-personage-trailer" onClick={() => dispatch(toggleOpen())}>
                            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className="movie-personage-trailer-logo" aria-hidden="true" role="img" width="110" height="110" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16">
                                <g fill="#a4a4a4">
                                    <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104l.022.26l.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105l-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006l-.087-.004l-.171-.007l-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103l.003-.052l.008-.104l.022-.26l.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007l.172-.006l.086-.003l.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/>
                                </g>
                            </svg>
                        </div>
                    </div>
                </div>
            </>
        )
    }else if(isError){
        console.error(error)
        content = <>
            <h1>Error</h1>
            <p>An Error occured</p>
        </>
    }
    return <div className="sub-panel">{content}</div>
}
