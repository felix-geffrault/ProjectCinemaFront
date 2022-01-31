import "./LoginPanel.css"
import {KeyboardEvent, useState} from "react";
import {LoginRequest, useLoginMutation} from "../../../../api/api";
import {setCredentials} from "./authSlice";
import {useAppDispatch} from "../../../../store/hooks";
import {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import {LoadingBtn} from "../../LoadingBtn/LoadingBtn";


export const LoginPanel : React.FC = () => {
    const [loginForm, setLoginForm] = useState<LoginRequest>({
        username: '',
        password: ''
    });

    const dispatch = useAppDispatch();

    const [login, {isLoading, isError, error}] = useLoginMutation();

    const handleChange = ({target: { name, value }}: React.ChangeEvent<HTMLInputElement>) =>
        setLoginForm(prev => ({ ...prev, [name]: value }))

    const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Enter"){
            handleSignIn();
        }
    }

    async function handleSignIn() {
        try {
            const token = await login(loginForm).unwrap();
            dispatch(setCredentials(token));
        }catch (err){
        }
    }

    return <div className="login-panel">
        <h1>Configure Project Cinema</h1>
        <form className="login-fields">
            <div className="form-field username-field">
                <label htmlFor="username">Username</label>
                <input type="text" name="username" value={loginForm.username} onChange={handleChange}/>
            </div>
            <div className="form-field password-field" >
                <label htmlFor="password">Password</label>
                <input type="password" name="password" value={loginForm.password} onChange={handleChange} onKeyDown={handleEnter}/>
            </div>
            {isError &&
            <div className="login-error">
                <p className="login-error-text">{((error as FetchBaseQueryError).data as {error: string}).error}</p>
            </div>
            }
        </form>
        <LoadingBtn isLoading={isLoading} onClick={handleSignIn} className="login-btn">Sign In</LoadingBtn>
    </div>
}