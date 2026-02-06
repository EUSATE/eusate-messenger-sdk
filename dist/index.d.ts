import { Environment, EusateMessengerSDK } from './utils';
declare global {
    interface Window {
        Eusate: object;
    }
}
declare const Eusate: EusateMessengerSDK;
export declare const EusateEnvironment: typeof Environment;
export default Eusate;
//# sourceMappingURL=index.d.ts.map