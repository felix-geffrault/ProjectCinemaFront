import {Category} from "../../../models/Category";
import {NavLink} from "react-router-dom";
import React from "react";
import './CategoryDisplay.css';
import {useGetActiveCategoriesNames} from "../../../hooks/CategoryHooks";


export const CategoriesDisplay : React.FC<{categories: Category[]}> = ({categories}) => {
    const selectedCategories = useGetActiveCategoriesNames();
    return <div className="badge-list">
        {categories.map((category, i) => {
            const categoryName = category.name.toLowerCase();
            return <NavLink
                to={(location) => {
                    const path = location.pathname;
                    if(!selectedCategories) return `${path}?categories=${categoryName}`;
                    else if(selectedCategories.includes(categoryName)){
                        return path + (selectedCategories.length > 1 ? `?categories=${(selectedCategories.filter(c => c !== categoryName).join('+'))}` : '');
                    }
                    else {
                        const newSelectedCategories = [...selectedCategories];
                        newSelectedCategories.push(categoryName);
                        return `${path}?categories=${newSelectedCategories.join('+')}`;
                    }}}
                isActive={() => selectedCategories && selectedCategories.includes(categoryName)}
                className="badge movie-category"
                activeClassName="selected"
                key={i}
            >{category.name}</NavLink>
        })}
    </div>
}