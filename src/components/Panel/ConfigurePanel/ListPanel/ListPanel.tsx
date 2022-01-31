import {ModelList} from "./ModelList/ModelList";
import "./ListPanel.css"
import {useGetMoviesQuery} from "../../../../api/api";

export const ListPanel : React.FC  = () => {


    return <div className="list-panel">
        <h1 className="list-panel-title">Configure Project Cinema</h1>
        <div className="entity-objects-container">
            <ModelList name="movie" title="Movies" handleGetData={useGetMoviesQuery} arg1="title" />
            {/*<ModelList name="personages" title="Personages" handleGetData={} arg1={} />*/}
        </div>
    </div>
}