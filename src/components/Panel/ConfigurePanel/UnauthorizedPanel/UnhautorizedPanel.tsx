import { Link } from "react-router-dom"
import "./Unhautorized.css"

export const UnauthorizedPanel : React.FC = () => {

return <div className="sub-panel">
        <h1>Unauthorized</h1>
        <p className="unauthorized-text">Your must be <Link to="/configure">connected</Link> to access this page.</p>
    </div>
}