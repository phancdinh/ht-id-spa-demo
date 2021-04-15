const HOST = "https://is-staging.hungthinhcorp.com.vn";
const LOCAL_HOST = "https://localhost:9443";

export const CONFIG = {
    // endpoint to request authorization code
    AUTHORIZE_ENDPOINT: `${HOST}/oauth2/authorize`,

    // endpoint to request access token
    TOKEN_ENDPOINT: `${HOST}/oauth2/token`,

    LOGOUT_URL: `${HOST}/oidc/logout`,
    RESPONSE_TYPE: "code",
    SCOPE: "openid profile phone",

    REDIRECT_URI: "https://topen-land.azurewebsites.net",

    // id of 'Demo - SPA' Service Provider
    CLIENT_ID: "zdORF98685rRNiCuMUz_k_1ff70a",
    // secret of 'Demo - SPA' Service Provider
    CLIENT_SECRET: "XsBHLe6jkmxwVAa26b1UsF2O3k8a",

    GRANT_TYPE: "authorization_code",
    CLIENT_URL: `https://localhost:9000`,
    COOKIE_PATH: "/",

    // endpoint of User Profile service
    PROFILE_SERVICE_URL: "https://profile-demo-ht.herokuapp.com",
    REGISTER_URL: "https://profile-dev.hungthinhcorp.com.vn/account/register",

    APIM_URL: "http://api-profile-dev.hungthinhcorp.com.vn:8080",
    // consumer key of API subscription on devportal
    APIM_ID: "e14sQyGGufr7dW5N8omkS2xHeVga",
    // consumer secret of API subscription on devportal
    APIM_SECRET: "NFZvypAiDQWkBrVjbNScKD8OM1wa",
};

export const CAR_CONFIG = {
    REDIRECT_URI: "https://topen-car.azurewebsites.net",
    CLIENT_ID: "djJZinXs_OeJ9j5R7ETec4KFLGMa",
    CLIENT_SECRET: "pWVTzZStieMoLBfRFFqLMUhzhEIa",
};
