// src/config/authConfig.ts
import { Providers } from "@microsoft/mgt-element";
import { Msal2Provider } from "@microsoft/mgt-msal2-provider";

export const configureAuthProvider = () => {
    if (!Providers.globalProvider) {
        Providers.globalProvider = new Msal2Provider({
            clientId: "bc659d2e-d885-4653-89a9-64a249dcad75",
            authority:
                "https://login.microsoftonline.com/e91262c3-f4c7-4e85-9e7c-70df74040857",
            redirectUri: "http://localhost:3000",
            scopes: ["user.read", "profile"],
        });
    }
};
