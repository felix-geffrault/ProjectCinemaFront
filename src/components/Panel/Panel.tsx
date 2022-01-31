import './Panel.css'
import {Switch, Route} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {DashBoardMovie} from "../../models/Movie";
import {togglePanel} from "./panelReducer";
import {MoviePanel} from "./MoviePanel/MoviePanel";
import {ShortActor} from "../../models/Actor";
import {ActorPanel} from "./ActorPanel/ActorPanel";
import {HomePanel} from "./HomePanel/HomePanel";
import {ConfigurePanel} from "./ConfigurePanel/ConfigurePanel";
import {MoviePanelEdit} from "./MoviePanel/Edit/MoviePanelEdit";
import {UnauthorizedPanel} from "./ConfigurePanel/UnauthorizedPanel/UnhautorizedPanel";


export const Panel: React.FC = () => {
    const entity = useAppSelector(state => state.panel.entity);
    const isOpen = useAppSelector(state => state.panel.isOpen);
    const isAdmin = useAppSelector(state => state.auth.isAuth);
    const dispatch = useAppDispatch();


    return <div className={`main-panel${isOpen ? " active" : ""}`}>
        <Switch>
            <Route exact path="/">
                <HomePanel/>
            </Route>
            <Route path="/movie/:id">
                <MoviePanel dashBoardMovie={entity as DashBoardMovie | undefined}/>
            </Route>
            <Route path="/actor/:id">
                <ActorPanel shortActor={entity as ShortActor | undefined}/>
            </Route>
            <Route exact path="/configure">
                <ConfigurePanel />
            </Route>
            <Route path="/configure/movie/:id">
                {isAdmin ?
                    <MoviePanelEdit dashBoardMovie={entity as DashBoardMovie | undefined}/>
                    :
                    <UnauthorizedPanel />
                }
            </Route>
        </Switch>
        <div className={`btn-panel-toggle${isOpen ? " active" : ""}`} onClick={() => dispatch(togglePanel())}>
            <svg width="26.5" height="50" viewBox="0 0 130 245" fill="rgba(19, 19, 19, 0.95)" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 62.3321L67.055 6.50006L123 6.4999L123 238.5L67.0549 238.5L7 182.668L7 62.3321Z"
                      stroke="#a4a4a4" strokeWidth="13"/>
                <path className={`btn-panel-toggle-arrow${isOpen ? " active" : ""}`}
                      d="M41.9645 117.464C40.0118 119.417 40.0118 122.583 41.9645 124.536L73.7843 156.355C75.7369 158.308 78.9027 158.308 80.8553 156.355C82.808 154.403 82.808 151.237 80.8553 149.284L52.5711 121L80.8553 92.7157C82.808 90.7631 82.808 87.5973 80.8553 85.6447C78.9027 83.692 75.7369 83.692 73.7843 85.6447L41.9645 117.464ZM48.5 116H45.5V126H48.5V116Z"
                      fill="#a4a4a4"/>
            </svg>
        </div>
    </div>
}
