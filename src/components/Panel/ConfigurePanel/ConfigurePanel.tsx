import {useAppSelector} from "../../../store/hooks";
import {LoginPanel} from "./LoginPanel/LoginPanel";
import {ListPanel} from "./ListPanel/ListPanel";


export const ConfigurePanel : React.FC = () => {
    const isAdmin = useAppSelector(state => state.auth.isAuth);



    return <div className="sub-panel">
        { isAdmin ?
            <ListPanel />
            :
            <LoginPanel />}
    </div>
}