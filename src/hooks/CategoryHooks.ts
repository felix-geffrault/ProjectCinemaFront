import {useLocation} from "react-router-dom";


export const useGetActiveCategoriesNames = () =>{
    const location = useLocation();
    return location.search.match(/(?<=categories=(?:[a-zA-Z\-]*\+?)*)[a-zA-Z\-]+/g)!;
}