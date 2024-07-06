import { cookies } from "next/headers";


export const setAuthToken = async (token: string | null) => {
    if (token) {
        cookies().set("Auth-token", token, {
            path: "/",
            domain: "localhost",
            maxAge: 300,
            httpOnly: true,
            secure: false,
        });
    } else {
        cookies().delete("Auth_Token");
    }
};

export const getAuthToken = async () => {
    return cookies().get("Auth-token")?.value.toString();
};