import React, {ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState} from "react";
import {DashBoardMovie, Movie} from "../../../../models/Movie";
import {useHistory, useParams} from "react-router-dom";
import {
    useGetActorsQuery,
    useGetCategoriesQuery,
    useGetDirectorsQuery,
    useGetMovieQuery,
    useUpdateMovieMutation,
    useUpdatePersonageMutation
} from "../../../../api/api";
import {Spinner} from "../../../Spinner/Spinner";
import {CategoriesDisplayEdit} from "../../CategoriesDisplay/CategoryDsiplayEdit";
import {Director} from "../../../../models/Director";
import {Actor, SimpleActor} from "../../../../models/Actor";
import "./MoviePanelEdit.css";
import {Category} from "../../../../models/Category";
import {DirectorEdit} from "./DirectorEdit";
import {PersonageFormProps, PersonagesEdit} from "./PersonagesEdit";
import {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import {SerializedError} from "@reduxjs/toolkit";

export interface MovieFormProps {
    id?: number,
    title: string,
    posterUrl: string,
    duration: string,
    description: string,
    director: string,
    trailerUrl: string,
    releaseYear: string,
    imdbRate: number,
    personages: PersonageFormProps[],
    categories: string[],
}

export interface FormErrorsProps {
    title?: string,
    posterUrl?: string,
    duration?: string,
    description?: string,
    director?: string,
    trailerUrl?: string,
    releaseYear?: string,
    imdbRate?: string,
    personages?: string,
    categories?: string,
    reqError?: string
}

export const MoviePanelEdit: React.FC<{dashBoardMovie: DashBoardMovie | undefined, }> =({dashBoardMovie}) => {
    const {id} = useParams<{id: string}>();
    const trueId = parseInt(id) > 100_000 ? parseInt(id) % 10_000 : parseInt(id);
    const { data: movie, isFetching, isSuccess, isError, error } = useGetMovieQuery<{data: Movie, isFetching: boolean, isSuccess: boolean, isError: boolean, error: string}>(trueId, {skip: id === "new"});
    const { data: actors, isFetching: isFetchingActors, isSuccess : isSuccessActors, isError: isErrorActors, error: errorActors} = useGetActorsQuery<{data: Actor[], isFetching: boolean, isSuccess: boolean, isError: boolean, error: string}>();
    const { data: directors, isFetching: isFetchingDirectors, isSuccess: isSuccessDirectors, isError: isErrorDirectors, error: errorDirectors } = useGetDirectorsQuery<{data: Director[], isFetching: boolean, isSuccess: boolean, isError: boolean, error: string}>();
    const { data: categories, isFetching: isFetchingCategories, isSuccess: isSuccessCategories, isError: isErrorCategories, error: errorCategories } = useGetCategoriesQuery<{data: Category[], isFetching: boolean, isSuccess: boolean, isError: boolean, error: string}>();
    const [updateMovie, resultUpdate] = useUpdateMovieMutation();
    const [updatePersonage, resultUpdatePersonage] = useUpdatePersonageMutation();
    const history = useHistory();


    const movieCategoies = useMemo(() => (movie && movie.categories.map(c => c.name)), [movie])
    const [formData, setFormData] = useState<MovieFormProps>({
        title: "",
        posterUrl: "",
        duration: "00:00:00",
        description: "",
        director: "",
        trailerUrl: "",
        releaseYear: (new Date()).toJSON().slice(0,10),
        imdbRate: 0,
        personages: [],
        categories: []
    });
    const [formErrors, setFormErrors] = useState<FormErrorsProps>({});

    const handleOnChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const field = e.target.name as ("posterUrl" | "duration" | "description" | "trailerUrl" | "releaseYear" | "imdbRate");
        setFormData({...formData, [field]: e.target.value});
        if(formErrors[field]){
            setFormErrors(prevState => ({...prevState, [field]: undefined}))
        }
    }

    const verifyForm = () => {
        let error = false;
        if(formData.title === ''){
            setFormErrors(prevState => ({...prevState, title: "A title is needed."}))
            error = true;
        }
        if(formData.posterUrl === ''){
            setFormErrors(prevState => ({...prevState, posterUrl: "A poster is needed."}))
            error = true;
        }
        if(formData.trailerUrl === ''){
            setFormErrors(prevState => ({...prevState, trailerUrl: "A youtube embedded video url is needed."}))
            error = true;
        }
        else if(!formData.trailerUrl.includes("https://www.youtube.com/embed/")){
            setFormErrors(prevState => ({...prevState, trailerUrl: "This is not a youtube embedded video url."}))
            error = true;
        }
        if(formData.director === ''){
            setFormErrors(prevState => ({...prevState, director: "Director unavailable"}))
            error = true;
        }if(formData.personages.some(p => p.actor === '')){
            setFormErrors(prevState => ({...prevState, personages: "Actor(s) unavailable(s)"}))
            error = true;
        }
        return error;
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log(formData);
        if(verifyForm()) return;
        updateMovie(formData).then((res) => {
            if(error in res){
                const error = (res as {error: FetchBaseQueryError | SerializedError}).error
                console.log(error);
            }else{
                const movieUpdated = (res as {data: Movie}).data;
                if(movieUpdated){
                    formData.personages.forEach(p => {
                        p.movie = movieUpdated!._links.self.href
                        p.movieId = trueId ? trueId : movieUpdated.id;
                        updatePersonage(p).then(res => {
                            console.log(res);
                        });
                    })
                }else{
                    console.log((res as any).error);
                }
            }
        });

    }

    useEffect(() => {movie && actors &&
        setFormData({
            id: trueId,
            title: movie.title,
            posterUrl: movie.posterUrl,
            duration: movie.duration,
            description: movie.description,
            director: directors && directors.find(d => d.fullName === movie.director.fullName)!._links!.self.href,
            trailerUrl: movie.trailerUrl,
            releaseYear: movie.releaseYear,
            imdbRate: movie.imdbRate,
            personages: movie.personages.map(p => ({
                id: p.id,
                name: p.name,
                actor: actors && actors.find(a => a.fullName === p.actor.fullName)!._links!.self.href
            })),
            categories: categories && categories.filter(c => movieCategoies.includes(c.name)).map(c => c._links!.self.href)
        })
    }, [movie, actors])

    useEffect(() => {
        if(resultUpdate.isSuccess && ((!resultUpdatePersonage.isLoading && resultUpdatePersonage.isSuccess) || formData.personages.length === 0)){
            if(id !== 'new'){
                history.push(`/movie/${id}`);
            }else{
                const linkArr = resultUpdate.data._links.self.href.split('/');
                const idFromLink = linkArr[linkArr.length -1 ];
                history.push(`/movie/${idFromLink}`);
            }
        }
    }, [resultUpdate, resultUpdatePersonage])


    let content;
    if(isFetching || isFetchingCategories || isFetchingActors || isFetchingDirectors){
        content = (<>
                <h1>{(dashBoardMovie && dashBoardMovie.title) || "Loading ..."}</h1>
                <Spinner />
            </>
        )
    }else if(isSuccess || !!id){
        content = (<form onSubmit={handleSubmit} >
               <div className="edit-header">
                   <h2>Movie Header</h2>
                   <div className="edit-element">
                       <label className="element-label" htmlFor="title">Title</label>
                       <input type="text" className="element-input" name="title" id="title" value={formData.title} onChange={handleOnChange}/>
                       {formErrors.title && <p className="form-error">{formErrors.title}</p>}
                   </div>
                   <div className="edit-header-wrapper">
                       <div className="edit-element">
                           <label className="element-label" htmlFor="imdbRate">IMDB rate</label>
                           <input type="number" max="10" min="0" step="0.1" className="element-input" name="imdbRate" id="imdbRate" value={formData.imdbRate} onChange={handleOnChange}/>
                       </div>
                       <div className="edit-element">
                           <label className="element-label" htmlFor="duration">Duration</label>
                           <input type="time" step="1" className="element-input" name="duration" id="duration" value={formData.duration} onChange={handleOnChange}/>
                       </div>
                       <div className="edit-element">
                           <label className="element-label" htmlFor="releaseYear">Release Year</label>
                           <input type="date" className="element-input" name="releaseYear" id="releaseYear" value={formData.releaseYear} onChange={handleOnChange}/>
                       </div>
                   </div>
                   <div className="edit-element edit-column">
                       <label className="element-label">Categories</label>
                       <CategoriesDisplayEdit intialSelectedCategories={movie ? movie.categories.map(c => c.name.toLowerCase()) : []} categories={categories} handleFormData={setFormData} />
                   </div>
               </div>
                <div className="edit-body">
                    <h2>Movie Body</h2>
                    <div className="edit-element edit-column">
                        <label className="element-label" htmlFor="description">Description</label>
                        <textarea className="element-input element-textarea" name="description" id="description" value={formData.description} onChange={handleOnChange} />
                    </div>
                    <div className="edit-element">
                        <label className="element-label" htmlFor="director">Director</label>
                        <DirectorEdit initialDirector={movie ? movie.director : null} directors={directors} handleFormData={setFormData} handleFormErrors={setFormErrors}/>
                        {formErrors.director &&
                        <p className="form-error">{formErrors.director}</p>}
                    </div>

                    <div className="edit-element">
                        <label className="element-label" htmlFor="trailerUrl">Trailer Url</label>
                        <input type="text" className="element-input" name="trailerUrl" id="trailerUrl" value={formData.trailerUrl} onChange={handleOnChange}/>
                        {formErrors.trailerUrl && <p className="form-error">{formErrors.trailerUrl}</p>}
                    </div>
                    <div className="edit-element">
                        <label className="element-label" htmlFor="posterUrl">Poster File</label>
                        <input type="text"  className="element-input" name="posterUrl" id="posterUrl" value={formData.posterUrl} onChange={handleOnChange}/>
                        {formErrors.posterUrl && <p className="form-error">{formErrors.posterUrl}</p>}
                    </div>
                </div>
                <div className="edit-personages">
                    <PersonagesEdit initialPersonages={movie ? movie.personages : []} actors={actors} handleFormData={setFormData} handleFormErrors={setFormErrors}/>
                    {formErrors.personages &&
                    <p className="form-error">{formErrors.personages}</p>}
                </div>
                <div className="save-container">
                    <input type="submit" value="Save" className="login-btn"/>
                </div>
            </form>
        )
    }else if(isError || isErrorActors || isErrorCategories || isErrorDirectors){
        console.error(error);
        content = <>
            <h1>Error</h1>
            <p>An Error occured</p>
        </>
    }
    return <div className="sub-panel">{content}</div>
}
