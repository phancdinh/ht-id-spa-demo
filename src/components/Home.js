import React, { useEffect, useState, useRef } from "react";
import ReactJson from "react-json-view";
import { sendAuthorizationRequest, sendTokenRequest } from "../actions/sign-in";
import { dispatchLogout } from "../actions/sign-out";
import {
    isValidSession,
    getAllSessionParameters,
    decodeIdToken,
    getCodeVerifier,
    setCodeVerifier,
} from "../actions/session";
import getPKCE from "../actions/pkce";
import { fetchUserProfile as fetchUserProfileApi, generateToken } from "../actions/profile";

export default function Home() {
    const pkcePair = useRef(getPKCE());

    const [profile, setProfile] = useState({});

    const [state, setState] = useState({
        idToken: {},
        tokenResponse: {},
        isLoggedIn: false,
        profile: {},
    });

    const isSessionValid = isValidSession();

    useEffect(updateCodeVerifier, []);

    useEffect(() => {
        if (isSessionValid) {
            const session = getAllSessionParameters();

            const _tokenResponse = {
                access_token: session.ACCESS_TOKEN,
                refresh_token: session.REFRESH_TOKEN,
                scope: session.SCOPE,
                id_token: session.ID_TOKEN,
                token_type: session.TOKEN_TYPE,
                expires_in: parseInt(session.EXPIRES_IN),
            };

            const idToken = decodeIdToken(session.ID_TOKEN);

            setState({
                idToken,
                tokenResponse: _tokenResponse,
                isLoggedIn: true,
            });

            fetchUserProfile(idToken.sub, session.ACCESS_TOKEN);
        } else {
            handleRequestToken();
        }
    }, [isSessionValid]);

    function handleRequestToken() {
        const code = new URL(window.location.href).searchParams.get("code");
        if (isSessionValid || !code) {
            return;
        }

        const codeVerifier = getCodeVerifier();
        sendTokenRequest(code, codeVerifier)
            .then((response) => {
                console.log("TOKEN REQUEST SUCCESS", response);
                setState({
                    tokenResponse: response[0],
                    idToken: response[1],
                    isLoggedIn: true,
                });
            })
            .catch((error) => {
                console.log("TOKEN REQUEST ERROR", error);
                setState({ isLoggedIn: false });
            });
    }

    // set Code Verifier to cookies
    function updateCodeVerifier() {
        const codeVerifier = getCodeVerifier();
        const code = new URL(window.location.href).searchParams.get("code");

        if (!code || !codeVerifier) {
            setCodeVerifier(pkcePair.current.codeVerifier);
        }
    }

    async function fetchUserProfile(username, accessToken) {
        const profile = await fetchUserProfileApi(username, accessToken, null);
        if (profile) {
            setProfile(profile);
        }
    }

    function handleLoginBtnClick() {
        sendAuthorizationRequest(pkcePair.current.codeChallenge);
    }

    function handleLogoutBtnClick() {
        dispatchLogout();
    }

    return (
        <div className="container home-container">
            <h1 className="ht-id">HT ID - Single Page App Demo</h1>
            <br />
            {state.isLoggedIn ? (
                <>
                    <br />
                    <h2>Token Response</h2>
                    <div className="card access-request-block">
                        <ReactJson src={state.tokenResponse} collapseStringsAfterLength={50} />
                    </div>
                    <br />
                    <h2>ID Token</h2>
                    <div className="card token-request-block">
                        <ReactJson src={state.idToken} collapseStringsAfterLength={50} />
                    </div>
                    <br />
                    {profile && (
                        <>
                            <h2>Profile</h2>
                            <div className="card token-request-block">
                                <ReactJson src={profile} collapseStringsAfterLength={50} />
                            </div>
                            <br />
                        </>
                    )}
                    <button className="btn btn-danger" onClick={handleLogoutBtnClick}>
                        LOGOUT
                    </button>
                </>
            ) : (
                <button className="btn btn-primary" onClick={handleLoginBtnClick}>
                    LOGIN
                </button>
            )}
        </div>
    );
}
