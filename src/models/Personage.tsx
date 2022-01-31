import {ShortActor} from "./Actor";
import {DashBoardMovie, Movie} from "./Movie";

export interface Personage {
    id?: number,
    name: string,
    actor: ShortActor,
    movie?: Movie
}

export interface PersonageFromActor {
    name: String,
    movie: DashBoardMovie
}