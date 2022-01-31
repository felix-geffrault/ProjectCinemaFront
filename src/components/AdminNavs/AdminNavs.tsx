import {Link, useHistory, useLocation} from "react-router-dom"
import "./AdminNavs.css"
import React from "react";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {displayMain} from "../Panel/panelReducer";
import {useDeleteMovieMutation} from "../../api/api";
import {DashBoardMovie} from "../../models/Movie";


export const AdminNavs : React.FC = () => {
    const location = useLocation();
    const history = useHistory();
    const dispatch = useAppDispatch();
    const [deleteMovie, result] = useDeleteMovieMutation();
    const entity = useAppSelector(state => state.panel.entity);

    const isMovie = location.pathname.includes('/movie/');
    const isNew = location.pathname.includes('/new');

    return <div className="admin-navs">
        {!location.pathname.includes('/configure/') && isMovie &&
        <Link to={`/configure${location.pathname}`} className="admin-nav-element">
            <div className="nav-btn edit-btn">
                <svg width="30" height="30" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.1875 28.4375H32.8125V30.625H2.1875V28.4375Z" fill="#a4a4a4"/>
                    <path d="M27.7812 9.84375C28.6562 8.96875 28.6562 7.65625 27.7812 6.78125L23.8437 2.84375C22.9687 1.96875 21.6563 1.96875 20.7812 2.84375L4.375 19.25V26.25H11.375L27.7812 9.84375ZM22.3125 4.375L26.25 8.3125L22.9688 11.5938L19.0312 7.65625L22.3125 4.375ZM6.5625 24.0625V20.125L17.5 9.1875L21.4375 13.125L10.5 24.0625H6.5625Z" fill="#a4a4a4"/>
                </svg>
            </div>
            <div className="nav-label">
                Edit
            </div>
        </Link>
        }
        { !isNew &&
        <Link to={`/configure/movie/new`} className="admin-nav-element">
            <div className="nav-btn edit-btn">
                <svg width="25" height="25" viewBox="0 0 36 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M2.28719 17.2197L34.9159 9.51313L32.7722 0.640625L0.14563 8.34719L2.28719 17.2197V17.2197ZM27.4609 9.35125L24.2934 4.29375L28.6903 3.23063L31.86 8.28813L27.4609 9.35125ZM20.1306 11.1231L16.9609 6.06563L21.3556 5.00469L24.5275 10.0622L20.1306 11.1231V11.1231ZM12.8003 12.895L9.63282 7.8375L14.0297 6.77656L17.1994 11.8341L12.8003 12.895V12.895ZM5.47219 14.6669L2.30251 9.60938L6.69719 8.54844L9.86688 13.6059L5.47219 14.6669V14.6669Z" fill="#a4a4a4"/>
                    <rect x="2.24121" y="17.4012" width="1.80492" height="17.3906" fill="#a4a4a4"/>
                    <rect x="33.2029" y="17.4012" width="1.80492" height="17.3906" fill="#a4a4a4"/>
                    <rect x="4.04614" y="19.2062" width="1.80492" height="29.1567" transform="rotate(-90 4.04614 19.2062)" fill="#a4a4a4"/>
                    <rect x="4.04614" y="34.7919" width="1.80492" height="29.1567" transform="rotate(-90 4.04614 34.7919)" fill="#a4a4a4"/>
                </svg>
            </div>
            <div className="nav-label">
                New
            </div>
        </Link>}
        {isMovie && !isNew &&
        <div className="admin-nav-element" onClick={() => {
            if(window.confirm("Do you really want to delete this movie ?")){
                dispatch(displayMain());
                deleteMovie((entity as DashBoardMovie).id);
                history.push('/');
            }
        }}>
            <div className="nav-btn edit-btn">
                <svg width="30" height="30" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.125 13.125H15.3125V26.25H13.125V13.125Z" fill="#a4a4a4"/>
                    <path d="M19.6875 13.125H21.875V26.25H19.6875V13.125Z" fill="#a4a4a4"/>
                    <path d="M4.375 6.5625V8.75H6.5625V30.625C6.5625 31.2052 6.79297 31.7616 7.2032 32.1718C7.61344 32.582 8.16984 32.8125 8.75 32.8125H26.25C26.8302 32.8125 27.3866 32.582 27.7968 32.1718C28.207 31.7616 28.4375 31.2052 28.4375 30.625V8.75H30.625V6.5625H4.375ZM8.75 30.625V8.75H26.25V30.625H8.75Z" fill="#a4a4a4"/>
                    <path d="M13.125 2.1875H21.875V4.375H13.125V2.1875Z" fill="#a4a4a4"/>
                </svg>
            </div>
            <div className="nav-label">
                Delete
            </div>
        </div>
        }
    </div>
}