import {DashBoardMovie, Movie} from "../models/Movie";
import axios from "axios";


const http = axios.create({baseURL:'http://localhost:8080'/*, headers: {''}*/});

interface MovieCollectionResponse{
    _embedded: {movies: DashBoardMovie[]},
    page: any,
    _links: any,
}

export async function getMovieDashboard(): Promise<MovieCollectionResponse> {
    return http.get('/movies?size=100').then((response) => response.data)
}

export async function getMoviePage(id: number): Promise<Movie> {
    return http.get(`/movies/${id}?projection=moviePage`)
}