"use strict"
import askForPromise from "ask-for-promise"
import { mount, unmount } from 'svelte'

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
function VisualController ( dependencies={} ) {
  
  /** @type {Object.<string, import('svelte').SvelteComponent>} */
  const cache = {}



  /**
   * Publish a svelte component to an html element
   * If component with given id exists, it will be replaced
   *
   * @param {import('svelte').SvelteComponent} Component - Svelte component to publish
   * @param {Object} [data={}] - Props to pass to the component
   * @param {string} id - Target container id
   * @returns {Promise<UpdateMethods>} - Update methods from the component
   */
  function publish ( Component, data, id ) {
                const 
                      hasKey = cache.hasOwnProperty ( id )
                    , endTask = askForPromise ()
                    ;

                if ( !Component ) {
                          console.error ( 'Error: Component is undefined' )
                          endTask.done ( false )
                          return endTask.promise
                    }

                if ( hasKey )   unmount ( cache[ id ] )
                
                let
                     node = document.getElementById ( id )
                   , updates = false
                   , setupUpdates = lib => updates = lib
                   ;

                if ( !node ) {
                          console.error ( `Can't find node with id: "${id}"` )
                          endTask.done ( false )
                          return endTask.promise
                    }

                if ( node.innerHTML.trim () !== '' )   node.innerHTML = ''

                let app = mount ( Component, { target: node, props: { dependencies, setupUpdates, ...data } } )
                cache[ id ] = app
                cache[ id ][ 'updates'] = updates ? updates : {}
                endTask.done ( cache[id]['updates'] )
                return endTask.promise
      } // publish func.



  /**
   * Destroy a published component
   *
   * @param {string} id - Container id
   * @returns {boolean} - True if component was found and destroyed
   */
  function destroy ( id ) {
                if ( cache[id] ) {
                          let item = cache[id];
                          unmount ( item )
                          delete cache[id]
                          return true
                     }
                else      return false
        } // destroy func.



  /**
   * Get update methods from a published component
   *
   * @param {string} id - Container id
   * @returns {UpdateMethods|false} - Update methods or false if not found
   */
  function getApp ( id ) {
            const item = cache[id];
            if (!item ) {
                    console.error ( `App with id: "${id}" was not found` )
                    return false
                }
            return item['updates']
    } // getApp func.



  /**
   * Check if a component was published
   *
   * @param {string} id - Container id
   * @returns {boolean} - True if component exists
   */
  function has ( id ) {
        return cache.hasOwnProperty ( id )
    } // has func.
  
  
  return {
            publish,
            destroy,
            getApp,
            has
          }

} // VisualController func.



export default VisualController


