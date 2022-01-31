import {Director} from "./Director";
import {Personage} from "./Personage";
import {Category} from "./Category";

export interface SimpleMovie{
    id: number,
    title: string
}

export interface DashBoardMovie{
    id: number,
    title: string,
    posterUrl: string,
}

export interface PlacedDashBoardMovie extends DashBoardMovie{
    x: number,
    y: number,
    selected?: number,
    selectedNumber?: number,
}

export interface Movie extends DashBoardMovie{
    duration: string,
    description: string,
    director: Director,
    trailerUrl: string,
    popularity: number,
    releaseYear: string,
    imdbRate: number,
    personages: Personage[],
    categories: Category[],
    _links: {
        self:{
            href: string
        }
    }
}


