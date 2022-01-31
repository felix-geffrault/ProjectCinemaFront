import {Category} from "./Category";
import {PersonageFromActor} from "./Personage";

export interface SimpleActor {
    fullName: string,
    _links: {
        self: {
            href: string
        }
    }
}

export interface ShortActor extends SimpleActor{
    id: number,
    photoUrl: string,
}

export interface Actor extends ShortActor{
    birthDate: string,
    description: string,
    wikipediaUrl: string,
    personages: PersonageFromActor[],
    categories: Category[]
}