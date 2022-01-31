import React from 'react';
import {
    BrowserRouter as Router,
} from "react-router-dom";
import './App.css';
import {Panel} from "./components/Panel/Panel";
import {Youtube} from "./components/YouTube/YouTube";
import {MovieDashBoardV2} from "./components/DashBoard/MovieDashBoardV2";
import {Navs} from "./components/Navs/Navs";
import {AdminNavs} from "./components/AdminNavs/AdminNavs";
import {useAppSelector} from "./store/hooks";

require("dotenv").config()

function App() {
    const isAuth = useAppSelector(state => state.auth.isAuth);

    return <Router>
        <div className="App">
            <MovieDashBoardV2 />
            <Panel />
            <Youtube />
            <Navs />
            {isAuth && <AdminNavs />}
        </div>
    </Router>;
}

export default App;
