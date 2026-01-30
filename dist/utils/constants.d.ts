export declare const PROD_CONFIG: {
    readonly ICOMOON_URL: "https://cdn.jsdelivr.net/gh/eusate/eusate-messenger-sdk@latest/src/assets/icomoon/style.css";
    readonly VERSION: string;
    readonly ENV: string | undefined;
    readonly DEBUG: boolean;
};
export declare const ENVIRONMENT_URLS: {
    development: string;
    production: string;
};
export declare const POST_MESSAGE_TYPES: {
    readonly INIT: "EUSATE_INIT";
    readonly READY: "EUSATE_READY";
    readonly AUTH_ERROR: "EUSATE_AUTH_ERROR";
    readonly CLOSE_CHAT: "CLOSE_CHAT";
    readonly OPEN_CHAT: "OPEN_CHAT";
    readonly DESTROY: "EUSATE_DESTROY";
};
export declare const ERROR_MESSAGES: {
    readonly NO_API_KEY: "[EUSATE SDK] API Key is required for initialization";
    readonly ERROR: "[EUSATE SDK] Error:";
    readonly INIT_TIMEOUT: "[EUSATE SDK] Initialization timeout";
    readonly IFRAME_LOAD: "[EUSATE SDK] Failed to load chat iframe";
    readonly NOT_INIT_YET: "[EUSATE SDK] Not initialized yet. Call init() first.";
    readonly DESTROYED_ALREADY: "[EUSATE SDK] Already destroyed";
    readonly ALREADY_INIT: "[Eusate SDK] Already initialized. Call destroy() first to reinitialize.";
};
//# sourceMappingURL=constants.d.ts.map