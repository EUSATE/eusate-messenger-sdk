declare enum Environment {
    PROD = "production",
    DEV = "development"
}
type MessengerConfig = {
    apiKey: string;
    environment?: Environment;
    onReady?: () => void;
    onError?: (error: Error) => void;
};
interface EusateMessengerSDK {
    init: (config: string | MessengerConfig) => void;
    open: () => void;
    close: () => void;
    destroy: () => void;
    isInitialized: () => boolean;
    isOpen: () => boolean;
    version: string;
}

declare global {
    interface Window {
        Eusate: object;
    }
}
declare const Eusate: EusateMessengerSDK;

export { Environment as EusateEnvironment, Eusate as default };
export type { MessengerConfig };
