import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import {useGetActorQuery, useGetMovieQuery} from "../../../api/api";
import {useAppDispatch} from "../../../store/hooks";
import {displayActor, displayMovie} from "../panelReducer";
import {Spinner} from "../../Spinner/Spinner";
import './ActorPanel.css';
import {Actor, ShortActor} from "../../../models/Actor";
import {CategoriesDisplay} from "../CategoriesDisplay/CategoriesDisplay";
import {MovieLink} from "../../MovieLink/MovieLink";

export const ActorPanel: React.FC<{shortActor: ShortActor | undefined, }> = ({shortActor}) => {
    const {id} = useParams<{id: string}>();
    const { data: actor, isFetching, isSuccess, isError, error } = useGetActorQuery<{data: Actor, isFetching: boolean, isSuccess: boolean, isError: boolean, error: string}>(id);
    const dispatch = useAppDispatch();

    useEffect( () => {
        if(actor) dispatch(displayActor(actor));
    }, [actor]);

    let content;
    if(isFetching){
        content = (<>
                <h1>{(shortActor && shortActor.fullName) || "Loading ..."}</h1>
                <Spinner />
            </>
        )
    }else if(isSuccess){
        const birthDate = new Date(actor.birthDate);
        const age = new Date(Date.now() - birthDate.getTime()).getFullYear() - 1970;
        content = (<>
                <div className="actor-header">
                    <div className="actor-header-infos">
                        <h1 className="actor-name">{actor.fullName}</h1>
                        <p className="header-field actor-birthdate"><span className="header-label">Birth Date : </span>{birthDate.toLocaleDateString()}</p>
                        <p className="header-field actor-age"><span className="header-label">Age : </span>{age} years old</p>
                        <div className="header-field actor-categories">
                            <span className="header-label">Categories : </span>
                            <CategoriesDisplay categories={actor.categories} />
                        </div>
                    </div>
                    <img className="actor-photo" alt={`${actor.fullName}`} src={actor.photoUrl} height={300}/>
                </div>
                <div className="actor-main">
                    <div className="field actor-description">
                        <h2 className="label actor-description-label">Description</h2>
                        <p className="description-text">{actor.description}</p>
                    </div>
                    <div className="field actor-roles">
                        <h2 className="label actor-roles-label">Roles</h2>
                        <ul className="actor-roles-text">
                            {actor.personages.map((p, index) => <li className="actor-role" key={index}>
                                <MovieLink movie={p.movie}>{p.movie.title}</MovieLink> : {p.name}
                            </li>)}
                        </ul>
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
