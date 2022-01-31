import {useAppDispatch, useAppSelector} from "../../store/hooks";
import './YouTube.css';
import {toggleOpen} from "./youtubeReducer";


export const Youtube : React.FC = () => {
    const videoUrl = useAppSelector(state => state.youtube.videoURL)
    const isOpen = useAppSelector(state => state.youtube.isOpen)
    const dispatch = useAppDispatch();

    return <div className={`youtube${isOpen ? " active" : ""}`} onClick={() => dispatch(toggleOpen())}>
        <iframe width="640" height="360" src={videoUrl} title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen></iframe>
    </div>
}