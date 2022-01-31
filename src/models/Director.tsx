export interface Director{
    id: number,
    fullName: string,
    wikipediaUrl: string
    _links?: {
        self:{
            href: string
        }
    }
}
