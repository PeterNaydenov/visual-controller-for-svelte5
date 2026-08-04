export type SetCallback = (markers: {
    start: Text;
    end: Text;
}) => string | void;
export type SetupUpdates = Object;
export type VisualControllerInstance = {
    set: SetCallback & ((fn: SetCallback, ...args: any[]) => void);
    publish: (alias: string, component: any, data?: object, extraParams?: object) => Promise<SetupUpdates | false>;
    destroy: (target?: string | string[]) => boolean | number;
    has: (alias: string) => boolean;
    getApp: (alias: string) => SetupUpdates | false;
    isEmpty: (alias: string) => boolean | undefined;
    list: () => string[];
    reset: () => void;
};
/**
 *  Callback that places dim markers into the DOM.
 *  @callback SetCallback
 *  @param {{ start: Text, end: Text }} markers
 *  @returns {string | void}
 */
/**
 *  Object passed to `setupUpdates` from inside a published component.
 *  @typedef {Object} SetupUpdates
 */
/**
 *  Controller instance returned by `VisualController`.
 *  @typedef {Object} VisualControllerInstance
 *  @property {SetCallback & ((fn: SetCallback, ...args: any[]) => void)} set
 *  @property {(alias: string, component: any, data?: object, extraParams?: object) => Promise<SetupUpdates | false>} publish
 *  @property {(target?: string | string[]) => boolean | number} destroy
 *  @property {(alias: string) => boolean} has
 *  @property {(alias: string) => SetupUpdates | false} getApp
 *  @property {(alias: string) => boolean | undefined} isEmpty
 *  @property {() => string[]} list
 *  @property {() => void} reset
 */
/**
 *  Visual Controller for Svelte 5
 *  @param {Object} [dependencies={}]
 *  @returns {VisualControllerInstance}
 */
declare function VisualController(dependencies?: any): VisualControllerInstance;
export default VisualController;
