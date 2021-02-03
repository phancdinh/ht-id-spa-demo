import React, { useEffect, useState, useRef } from "react";
import { sendAuthorizationRequest, sendTokenRequest } from "../actions/sign-in";
import { dispatchLogout } from "../actions/sign-out";
import { CAR_CONFIG, CONFIG } from "../config";
import {
    isValidSession,
    getAllSessionParameters,
    decodeIdToken,
    getCodeVerifier,
    setCodeVerifier,
} from "../actions/session";
import getPKCE from "../actions/pkce";
import { fetchUserProfile as fetchUserProfileApi, generateToken } from "../actions/profile";
import hotram from "../img/ho-tram.jpg";
import lavitacharm from "../img/lavita.jpg";
import universe from "../img/universe.jpg";

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

            fetchUserProfile(idToken.ht_id, session.ACCESS_TOKEN);
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

    async function fetchUserProfile(ht_id, accessToken) {
        const apimAccessToken = await generateToken();
        const profile = await fetchUserProfileApi(ht_id, accessToken, apimAccessToken);
        if (profile) {
            setProfile(profile);
        }
    }

    function handleLoginBtnClick() {
        sendAuthorizationRequest(pkcePair.current.codeChallenge);
    }

    function handleSignUpBtnClick() {
        window.open("https://app-profile-dev.hungthinhcorp.com.vn/account/register", "_blank");
    }

    function handleLogoutBtnClick() {
        dispatchLogout();
    }

    const carUrl = `${CONFIG.AUTHORIZE_ENDPOINT}?response_type=${CONFIG.RESPONSE_TYPE}&scope=${CONFIG.SCOPE}&redirect_uri=${CAR_CONFIG.REDIRECT_URI}&client_id=${CAR_CONFIG.CLIENT_ID}`;

    return (
        <div className="home-container">
            {state.isLoggedIn ? (
                <>
                    <div className="profile-menu d-flex ">
                        <div>{profile && <span>{profile.full_name}</span>}</div>
                        <div>
                            <img src="" alt="" />
                        </div>
                        <div>
                            <a href={"javascript:void()"} onClick={handleLogoutBtnClick}>
                                Đăng Xuất
                            </a>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="btn-wrapper">
                        <button
                            className="btn-common float-right login"
                            onClick={handleLoginBtnClick}
                        ></button>
                        <button
                            className="btn-common float-right mr-4 sign-up"
                            onClick={handleSignUpBtnClick}
                        ></button>
                    </div>
                    <br />
                </>
            )}
            <div className="container main-contain">
                <div className="row">
                    <div className="col-4 mb-5 item-ht">
                        <div>
                            <div className="img-wrap">
                                <a href="#">
                                    <img className="img-fluid" src={lavitacharm} />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-4 mb-5 item-ht">
                        <div>
                            <div className="img-wrap">
                                <a href="#">
                                    <img className="img-fluid" src={hotram} />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-4 mb-5 item-ht">
                        <div>
                            <div className="img-wrap">
                                <a href="#">
                                    <img className="img-fluid" src={universe} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {state.isLoggedIn && (
                <div className="topen-car text-center">
                    <a href={carUrl} className="text-white car" target="_blank" title="topen-car"></a>
                </div>
            )}
        </div>
    );
}
