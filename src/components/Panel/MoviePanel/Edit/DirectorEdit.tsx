import {Director} from "../../../../models/Director";
import React, {useEffect, useState} from "react";
import {FormErrorsProps, MovieFormProps} from "./MoviePanelEdit";

interface DirectorEditProps{
    initialDirector: Director | null,
    directors: Director[],
    handleFormData: React.Dispatch<React.SetStateAction<MovieFormProps>>,
    handleFormErrors: React.Dispatch<React.SetStateAction<FormErrorsProps>>
}

export const DirectorEdit: React.FC<DirectorEditProps> =  React.memo(({initialDirector, directors, handleFormData, handleFormErrors}) => {

    const [directorName, setDirectorName] = useState<string>(initialDirector ? initialDirector.fullName : "");

    useEffect(() => {
        if(directors){
            const director = directors.find(d => d.fullName === directorName);
            if(director){
                handleFormErrors(prevState => ({...prevState, director: undefined}));
            }
            handleFormData(prevState => ({...prevState, director: director ? director._links!.self.href : ""}));
        }
    }, [directors, directorName])

    return <>
        <input list="directors-list"  className="element-select" name="director" value={directorName} onChange={e => setDirectorName(e.target.value)}/>
        <datalist id="directors-list">
            {directors && directors.map((d,i) => (
                <option key={i}>{d.fullName}</option>
            ))}
        </datalist>
    </>
})