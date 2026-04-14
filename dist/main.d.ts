export default VisualController;
export type VisualControllerAPI = {
    /**
     * - Publish a svelte component to an html element
     */
    publish: Function;
    /**
     * - Destroy a published component
     */
    destroy: Function;
    /**
     * - Get update methods from a published component
     */
    getApp: Function;
    /**
     * - Check if component was published
     */
    has: Function;
};
/**
 * Update methods exposed by a published component via setupUpdates
 */
export type UpdateMethods = {
    /**
     * - Example update method
     */
    changeMessage?: Function;
};
/**
 * @typedef {Object} VisualControllerAPI
 * @property {Function} publish - Publish a svelte component to an html element
 * @property {Function} destroy - Destroy a published component
 * @property {Function} getApp - Get update methods from a published component
 * @property {Function} has - Check if component was published
 */
/**
 * @typedef {Object} UpdateMethods
 * Update methods exposed by a published component via setupUpdates
 * @property {Function} [changeMessage] - Example update method
 */
/**
 * Visual Controller for Svelte 5
 * Controls multiple svelte 5 apps with a single controller
 *
 * @param {Object} [dependencies={}] - External dependencies exposed to components
 * @returns {VisualControllerAPI} - Controller instance with publish, destroy, getApp, has methods
 */
declare function VisualController(dependencies?: any): VisualControllerAPI;
