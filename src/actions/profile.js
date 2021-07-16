import axios from "axios";
import { CONFIG } from "../config";

export async function generateToken() {
    try {
        const token = btoa(`${CONFIG.APIM_ID}:${CONFIG.APIM_SECRET}`);

        const { data } = await axios.post(`${CONFIG.APIM_URL}/token`, "grant_type=client_credentials", {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${token}`,
            },
        });

        return data.access_token;
    } catch (error) {
        console.log("generateToken error", error);
    }
}

export async function fetchUserProfile(username, accessToken, apimAccesstoken) {
    if (!accessToken || !apimAccesstoken) {
        return;
    }

    try {
        const { data: profile } = await axios.get(
            `${CONFIG.APIM_URL}/api/profiles/v1.0.0/info/${username}/basic-info`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );
        return profile;
    } catch (error) {
        console.log(error);
    }
}
