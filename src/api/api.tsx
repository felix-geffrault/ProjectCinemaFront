import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {DashBoardMovie, Movie} from "../models/Movie";
import {BaseQueryResult } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import {SimpleActor} from "../models/Actor";
import {Category} from "../models/Category";
import {RootState} from "../store";
import {Director} from "../models/Director";
import {MovieFormProps} from "../components/Panel/MoviePanel/Edit/MoviePanelEdit";
import {Personage} from "../models/Personage";
import {PersonageFormProps} from "../components/Panel/MoviePanel/Edit/PersonagesEdit";

export interface LoginRequest{
    username: string,
    password: string
}

export interface TokenResponse{
    token: string
}



export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }
            return headers
        }}
    ),
    tagTypes: ['Movie'],
    endpoints: builder => ({
        getMovies: builder.query<Object[], string[] | null>({
            query: (categories) => categories ? `/movies/search/categories?names=${categories.join(',')}` : '/movies?size=200',
            transformResponse(response: BaseQueryResult<any>): Promise<DashBoardMovie[]> | DashBoardMovie[] {
                return response._embedded.movies;
            },
            // @ts-ignore
            providesTags: ['Movie'],
        }),
        getMovie: builder.query({
            query: id => `/movies/${id}?projection=moviePage`,
            // @ts-ignore
            providesTags: (result, error, arg) => ([({ type: 'Movie' as const, id: arg.id as number })]),
        }),
        getActor: builder.query( {
            query: id => `/actors/${id}?projection=actorPage`,
        }),
        getDataList: builder.query({
            query: q => `/search?q=${q}`
        }),
        getCategories: builder.query<Object[], void>( {
            query: () => '/categories?size=300',
            transformResponse(response: BaseQueryResult<any>): Promise<Category[]> | Category[] {
                return response._embedded.categories;
            },
            keepUnusedDataFor: 600
        }),
        getDirectors: builder.query<Object[], void>( {
            query: () => `/directors?projection=simpleDirector&size=300`,
            transformResponse(response: BaseQueryResult<any>): Promise<Director[]> | Director[] {
                return response._embedded.directors;
            },
        }),
        getActors: builder.query<Object[], void>( {
            query: () => `/actors?projection=simpleActor&size=300`,
            transformResponse(response: BaseQueryResult<any>): Promise<SimpleActor[]> | SimpleActor[] {
                return response._embedded.actors;
            },
        }),
        login : builder.mutation<TokenResponse, LoginRequest >({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials
            })
        }),
        updateMovie: builder.mutation<Movie, MovieFormProps>({
            query: (form) => ({
                url: `/movies${form.id ? `/${form.id}` : ''}`,
                method: form.id ? 'PATCH' : 'POST',
                body: form
            }),
            // @ts-ignore
            invalidatesTags: (result, error, arg) => [{ type: 'Movie', id: arg.id }, 'Movie'],
        }),
        updatePersonage: builder.mutation<{data: Personage}, PersonageFormProps>({
            query: (p) => ({
                url: `/personages${p.id ? `/${p.id}` : ''}`,
                method: p.id ? (p.delete ? 'DELETE' :  'PATCH') : 'POST',
                body: p.delete ? '' : p
            }),
            invalidatesTags: (result, error, arg) => ([{ type: 'Movie', id: arg.movieId}, 'Movie']),
        }),
        deleteMovie: builder.mutation<undefined, number>({
            query: (id) => ({
                url: `/movies/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, arg) => ([{ type: 'Movie', id: arg}, 'Movie']),
        })
    })
})

export const {
    useGetMoviesQuery,
    useGetMovieQuery,
    useGetActorQuery,
    useGetDataListQuery,
    useGetCategoriesQuery,
    useLoginMutation,
    useGetDirectorsQuery,
    useGetActorsQuery,
    useUpdateMovieMutation,
    useUpdatePersonageMutation,
    useDeleteMovieMutation
} = apiSlice