import {DashBoardMovie} from "../../models/Movie";
import {Link, LinkProps, useLocation} from "react-router-dom";
import React from "react";
import {useAppDispatch} from "../../store/hooks";
import {displayMovie} from "../Panel/panelReducer";

interface MovieLinkProps extends Omit<LinkProps, 'to' | 'onClick'> {
    movie: DashBoardMovie
}

export const MovieLink = React.forwardRef<HTMLAnchorElement, MovieLinkProps>( ({movie, ...rest}, ref) => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    return <Link {...rest} to={{pathname: `/movie/${movie.id}`, search: location.search}} onClick={() => dispatch(displayMovie(movie))} ref={ref} />
});