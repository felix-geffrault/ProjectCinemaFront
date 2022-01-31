import React, {useEffect, useState} from "react";
import {SimpleActor} from "../../../../models/Actor";
import {FormErrorsProps, MovieFormProps} from "./MoviePanelEdit";


export interface PersonageFormProps {
    movieId?: number;
    id?: number,
    name: string,
    actor: string,
    movie?: string,
    delete?: boolean
}

interface PersonageInputProps{
    personage: PersonageInitial,
    actors: SimpleActor[],
    index: number,
    handleFormData: React.Dispatch<React.SetStateAction<MovieFormProps>>,
    handleDelete: (index: number) => void,
    handleFormErrors: React.Dispatch<React.SetStateAction<FormErrorsProps>>
}

const PersonageInput: React.FC<PersonageInputProps> = ({personage: initialPersonage, actors, index, handleFormData, handleDelete, handleFormErrors}) => {
    const [personage, setPersonage] = useState<{id?: number, name: string, actorName: string}>({id: initialPersonage.id, name: initialPersonage.name, actorName: initialPersonage.actor ?  initialPersonage.actor.fullName : ""});

    useEffect(() => {
        if(actors){
            const actor = actors.find(a => a.fullName === personage.actorName);
            handleFormData(prevState => {
                const actorRef = actor ? actor._links!.self.href : ""
                const personageForm : PersonageFormProps = {
                    name: personage.name,
                    actor: actorRef
                }
                if(personage.id) personageForm.id = personage.id;
                let personages  = [...prevState.personages];
                personages.length > index-1 ? personages.splice(index, 1, personageForm): personages.push(personageForm);
                return {...prevState, personages: personages}
            })
            if(actor){
                handleFormErrors(prevState => ({...prevState, personages: undefined}))
            }
        }
    }, [personage, actors])

    const handleDeleteLocal = () => {
        if(personage.id){
            handleFormData(prevState => {
                const personageForm : PersonageFormProps = {
                    id: personage.id,
                    name: "",
                    actor: "",
                    delete: true
                }
                let personages  = [...prevState.personages];
                personages.splice(index, 1, personageForm);
                return {...prevState, personages: personages}
            })
        }else{
            handleFormData(prevState => {
                let personages  = [...prevState.personages];
                if(personages.length > index-1){
                    personages.splice(index, 1);
                }
                return {...prevState, personages: personages}
            })
        }
        handleDelete(index);
    }

    return <div className="personage-container">
        <h4 className="personage-header" >Peronage {index+1}</h4>
        <div className="personage-grid">
            <div className="edit-element">
                <label className="element-label" htmlFor={`personage-${index}-name`}>Name</label>
                <input className="element-input" name={`personage-${index}-name`} value={personage.name}
               onChange={e => setPersonage(p => ({...p , name: e.target.value}))}/>
            </div>
            <div className="edit-element">
                <label className="element-label" htmlFor={`personage-${index}-actor`}>Actor</label>
                <input type="text" list="actors-list" className="element-select" name={`personage-${index}-actor`}
                       id={`personage-${index}-actor`} value={personage.actorName}
                       onChange={e => setPersonage(p => ({...p, actorName: e.target.value}))}
                />
            </div>
            <button type="button" className="btn-svg delete-personage-btn" onClick={handleDeleteLocal}>
                <svg width="30" height="30" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.125 13.125H15.3125V26.25H13.125V13.125Z" fill="#a4a4a4"/>
                    <path d="M19.6875 13.125H21.875V26.25H19.6875V13.125Z" fill="#a4a4a4"/>
                    <path d="M4.375 6.5625V8.75H6.5625V30.625C6.5625 31.2052 6.79297 31.7616 7.2032 32.1718C7.61344 32.582 8.16984 32.8125 8.75 32.8125H26.25C26.8302 32.8125 27.3866 32.582 27.7968 32.1718C28.207 31.7616 28.4375 31.2052 28.4375 30.625V8.75H30.625V6.5625H4.375ZM8.75 30.625V8.75H26.25V30.625H8.75Z" fill="#a4a4a4"/>
                    <path d="M13.125 2.1875H21.875V4.375H13.125V2.1875Z" fill="#a4a4a4"/>
                </svg>
            </button>
        </div>
    </div>
}

interface PersonagesEditProps{
    initialPersonages: PersonageInitial[],
    actors: SimpleActor[],
    handleFormData: React.Dispatch<React.SetStateAction<MovieFormProps>>,
    handleFormErrors: React.Dispatch<React.SetStateAction<FormErrorsProps>>
}

interface PersonageInitial{
    name: string,
    id?: number,
    actor: SimpleActor | undefined,
    delete?: boolean
}


export const PersonagesEdit: React.FC<PersonagesEditProps> = React.memo(({initialPersonages, actors, handleFormData, handleFormErrors}) => {

    const [personages, setPersonages] = useState<PersonageInitial[]>(initialPersonages);

    const handleAddPersonage = () => {
        if(personages.length < 3 ){
            setPersonages([...personages, {name: "", actor: undefined}])
        }
    }

    const handleDeletePersonage = (index: number) => {
        setPersonages(personages.length > 1 ? [...personages].splice(index,1) : []);
    }

    return <>
        <div className="personage-edit-header">
            <h2>Personages</h2>
            <button type="button" className="btn-svg btn-personage-add" onClick={handleAddPersonage}>
                <svg width="30" height="30" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.1875 28.4375H32.8125V30.625H2.1875V28.4375Z" fill="#a4a4a4"/>
                    <path d="M27.7812 9.84375C28.6562 8.96875 28.6562 7.65625 27.7812 6.78125L23.8437 2.84375C22.9687 1.96875 21.6563 1.96875 20.7812 2.84375L4.375 19.25V26.25H11.375L27.7812 9.84375ZM22.3125 4.375L26.25 8.3125L22.9688 11.5938L19.0312 7.65625L22.3125 4.375ZM6.5625 24.0625V20.125L17.5 9.1875L21.4375 13.125L10.5 24.0625H6.5625Z" fill="#a4a4a4"/>
                </svg>
            </button>
        </div>
        <div className="personages-edit">
            <div className="personages-edit-inputs">
                {personages.map((p, i) => (
                    !p.delete &&
                    <PersonageInput personage={p} index={i} actors={actors} handleFormData={handleFormData} handleDelete={handleDeletePersonage} handleFormErrors={handleFormErrors} key={i}/>
                ))}
            </div>
            <datalist id="actors-list">
                {actors && actors.map((a, index) => (
                    <option value={a.fullName} key={index}/>
                ))}
            </datalist>
        </div>
    </>

})

