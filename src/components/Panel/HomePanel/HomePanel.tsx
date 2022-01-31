import {useGetCategoriesQuery, useGetDataListQuery} from "../../../api/api";
import {useState} from "react";
import {useAppDispatch} from "../../../store/hooks";
import {useHistory} from "react-router-dom";
import './HomePanel.css'
import { Category } from "../../../models/Category";
import {CategoriesDisplay} from "../CategoriesDisplay/CategoriesDisplay";

export type ListOption = {
    id: number,
    value: string,
    type: string
}

const SearchInput : React.FC = () => {
    const [query, setQuery] = useState("");

    const skip = query.length < 3;
    const { data, isError, error } = useGetDataListQuery<{data: ListOption[], isFetching: boolean, isSuccess: boolean, isError: boolean, error: string}>(query, {skip});
    let history = useHistory();

    return <div className="search-container">
            {/*<h2 className="label">Search</h2>*/}
        <h2 className="search-title">What movie do you want to watch today ?</h2>
        <div className="search-input">
                <input type="text" value={query} list="querySuggestion" onChange={e => {
                    const q = e.target.value;
                    q === (data && data.length && data[0].value) ? history.push(`/${data[0].type}/${data[0].id}`) : setQuery(q);
                }}
                       className="input-query" placeholder="SpiderMan, Brad Pitt, ..."/>
                <button type="button" className="btn-search">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" fill="white" role="img" width="30px" height="30px" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396l1.414-1.414l-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8s3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6s-6-2.691-6-6s2.691-6 6-6z" /></svg>
                </button>
                <datalist id="querySuggestion">
                    {data && data.map(option =>
                        <option key={option.id} >{option.value}</option>
                    )}
                </datalist>
            </div>
        </div>
}

const CategoriesFilter : React.FC = () => {
    const { data: categories, isFetching, isSuccess, isError, error } = useGetCategoriesQuery<{data: Category[], isFetching: boolean, isSuccess: boolean, isError: boolean, error: string}>();

    return <div className="categories-container">
        <p>Filter by category</p>
        {categories && <CategoriesDisplay categories={categories} />}
    </div>
}


export const HomePanel = () => {

    return <div className="sub-panel home-panel">
        <h1 className="home-title">Project Cinema</h1>
        <SearchInput />
        <CategoriesFilter />
    </div>
}