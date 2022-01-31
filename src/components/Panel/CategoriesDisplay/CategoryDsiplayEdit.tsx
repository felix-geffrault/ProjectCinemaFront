import {Category} from "../../../models/Category";
import React, {useEffect, useState} from "react";
import './CategoryDisplay.css';
import './CategoryDisplayEdit.css';
import {MovieFormProps} from "../MoviePanel/Edit/MoviePanelEdit";

interface CategoryDsiplayEditProps {
    intialSelectedCategories: string[],
    categories: Category[],
    handleFormData: React.Dispatch<React.SetStateAction<MovieFormProps>>
}


export const CategoriesDisplayEdit : React.FC<CategoryDsiplayEditProps> = React.memo(({intialSelectedCategories, categories, handleFormData}) => {
    const [selectedCategories, setSelectedCategories] = useState(intialSelectedCategories);

    useEffect(() => {
        categories && handleFormData(prevState => ({
            ...prevState,
            "categories": categories.filter(c => selectedCategories.includes(c.name.toLowerCase())).map(c => c._links!.self.href)
        }))
    }, [selectedCategories])

    return <div className="badge-list">
        {categories && categories.map((category, i) => {
            const categoryName = category.name.toLowerCase();
            const selected = selectedCategories && selectedCategories.includes(categoryName);
            return <div  className={`badge movie-category${ selected && " selected"}`}
                          key={i}>
                <p
                    onClick={() => {
                        if(selected){
                            setSelectedCategories(selectedCategories.filter(n => n !== category.name.toLowerCase()))
                        }else{
                            setSelectedCategories([...selectedCategories, category.name.toLowerCase()]);
                        }
                    }}
                >{category.name}</p>
            </div>
        })}
    </div>
});