import React, {HTMLAttributes} from "react";
import './LoadingBtn.css'

export interface LoadingBtnProps extends HTMLAttributes<HTMLButtonElement>{
    isLoading: boolean
}

export const LoadingBtn : React.FC<LoadingBtnProps> = ({isLoading, className, ...rest}) => {
    return <div className="loading-btn-wrapper">
        <button type="button" className={`loading-btn ${className} ${(isLoading ? "": " active")}`} {...rest} />
        {isLoading ?
            <svg height="100" width="100" className="mini-spinner">
                <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="10" fillOpacity="0" strokeDasharray="47">
                    <animate attributeName="opacity" values="0;1" dur="0s" begin="10s" />
                </circle>
            </svg>
            : ''}
    </div>
    }