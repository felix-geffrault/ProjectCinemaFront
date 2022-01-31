import React, {HTMLAttributes} from "react";
import './Spinner.css'

export const Spinner: React.FC<HTMLAttributes<HTMLDivElement>> = ({className, ...rest}) => {
    return <div className={`spinner ${className}`} {...rest}>
        <p className="loading-text">Loading</p>
        <svg height="200" width="200">
            <circle className="circle" cx="100" cy="100" r="95" stroke="white" strokeWidth="10" fillOpacity="0"/>
        </svg>
    </div>
}