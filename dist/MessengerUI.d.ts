import { MessengerConfig } from './utils';
declare class EusateMessenger {
    private static instance;
    private container;
    private fabIframe;
    private chatIframe;
    private fabIcon;
    private fab;
    private apiKey;
    private chatUrl;
    private onReady?;
    private onError?;
    private chatInitialized;
    private isChatOpen;
    private isDestroyed;
    private fabClickHandler;
    private messageHandler;
    private initTimeout;
    private constructor();
    static getInstance(config?: MessengerConfig): EusateMessenger;
    private init;
    private setupContainer;
    private setupFabIframe;
    private setupChatIframe;
    private handleChatIframeLoad;
    private handleIframeError;
    private setupMessageHandlers;
    private handleReady;
    private handleError;
    private loadFabButton;
    isInitialized: () => boolean;
    isOpen: () => boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
    destroy: () => void;
}
export default EusateMessenger;
//# sourceMappingURL=MessengerUI.d.ts.map