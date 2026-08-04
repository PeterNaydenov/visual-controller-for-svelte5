"use strict"
/**
 *  Visual Controller for Svelte 5 — v3.0.0
 *  A thin lifecycle bridge between the inlined dim subset (see `./dim.js`)
 *  and Svelte 5. Define regions with invisible markers via `set`, then
 *  mount Svelte apps into those regions via `publish`. `destroy` empties
 *  a region without removing the markers, so the same alias can host a
 *  different app later.
 *
 *  @packageDocumentation
 */

import askForPromise from 'ask-for-promise'
import { mount, unmount } from 'svelte'
import dim from './dim.js'


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
function VisualController ( dependencies = {} ) {
    /** @type {Object.<string, { app: any, mountSpan: HTMLElement, setupUpdates: SetupUpdates }>} */
    const cache = {}
    /** @type {Set<string>} */
    const aliases = new Set()
    /** @type {Object.<string, { start: Text, end: Text }>} */
    const markersMap = {}
    /** @type {ReturnType<typeof dim>} */
    const d = dim()


    function set ( fn, ...args ) {
        let capturedAlias = null
        let capturedMarkers = null
        d.set ( ( markers, ...rest ) => {
            capturedMarkers = markers
            const ret = fn ( markers, ...rest )
            if ( typeof ret === 'string' )   capturedAlias = ret
            return ret
        }, ...args )
        if ( capturedAlias ) {
            aliases.add ( capturedAlias )
            markersMap[capturedAlias] = capturedMarkers
        }
    }


    function publish ( alias, component, data = {}, extraParams = {} ) {
        const endTask = askForPromise ()
        void extraParams

        if ( !component ) {
            console.error ( `Error: Component is undefined` )
            endTask.done ( false )
            return endTask.promise
        }
        if ( !alias || typeof alias !== 'string' ) {
            console.error ( `Error: Alias is missing or invalid` )
            endTask.done ( false )
            return endTask.promise
        }

        const markers = markersMap[alias]
        if ( !markers || !markers.start.isConnected || !markers.end.isConnected ) {
            console.error ( `Error: Region "${alias}" was not defined or its markers are orphaned. Call html.set(...) first.` )
            endTask.done ( false )
            return endTask.promise
        }

        if ( cache[alias] )   destroy ( alias )

        const between = []
        let n = markers.start.nextSibling
        while ( n && n !== markers.end ) { between.push ( n ); n = n.nextSibling }

        /** @type {HTMLElement} */
        let mountTarget
        let useSSR = false

        if ( between.length === 0 ) {
            mountTarget = document.createElement ( 'span' )
            mountTarget.style.display = 'contents'
            markers.end.parentNode.insertBefore ( mountTarget, markers.end )
            useSSR = false
        } else if ( between.length === 1 && between[0].nodeType === 1 ) {
            mountTarget = /** @type {HTMLElement} */ (between[0])
            useSSR = true
        } else {
            const wrapper = document.createElement ( 'span' )
            wrapper.style.display = 'contents'
            markers.end.parentNode.insertBefore ( wrapper, markers.end )
            between.forEach ( node => wrapper.appendChild ( node ) )
            mountTarget = wrapper
            useSSR = true
        }

        const entry = { app: null, mountSpan: mountTarget, setupUpdates: {} }
        cache[alias] = entry

        const setupUpdates = lib => { entry.setupUpdates = lib }
        const props = { dependencies, ...data, setupUpdates }

        if ( useSSR ) {
            entry.app = mount ( component, { target: mountTarget, props } )
        } else {
            entry.app = mount ( component, { target: mountTarget, props } )
        }

        endTask.done ( entry.setupUpdates )
        return endTask.promise
    }


    function destroy ( target ) {
        if ( target === undefined ) {
            let count = 0
            for ( const a of Object.keys ( cache ) ) {
                destroy ( a )
                count++
            }
            return count
        }
        if ( Array.isArray ( target ) ) {
            let count = 0
            for ( const a of target ) {
                if ( typeof a === 'string' && cache[a] ) {
                    destroy ( a )
                    count++
                }
            }
            return count
        }
        if ( typeof target !== 'string' ) {
            console.error ( `Error: destroy() expects a string alias or an array of strings` )
            return false
        }
        const entry = cache[target]
        if ( !entry )   return false
        if ( entry.app )   unmount ( entry.app )
        if ( entry.mountSpan.parentNode ) {
            entry.mountSpan.parentNode.removeChild ( entry.mountSpan )
        }
        delete cache[target]
        return true
    }


    function has ( alias ) {
        return Boolean ( cache[alias] )
    }


    function getApp ( alias ) {
        const entry = cache[alias]
        if ( !entry ) {
            console.error ( `App with alias: "${alias}" was not found.` )
            return false
        }
        return entry.setupUpdates
    }


    function list () {
        return Array.from ( aliases )
    }


    function isEmpty ( alias ) {
        if ( !alias || typeof alias !== 'string' ) {
            console.error ( `Error: Alias is missing or invalid` )
            return undefined
        }
        const range = d.get ( alias )
        if ( !range ) {
            console.error ( `Region "${alias}" was not defined. Call html.set(...) first.` )
            return undefined
        }
        return range.isEmpty ()
    }


    function reset () {
        for ( const alias of Object.keys ( cache ) )   destroy ( alias )
        aliases.clear ()
        for ( const alias of Object.keys ( markersMap ) )   delete markersMap[alias]
        d.reset ()
    }


    return {
          set
        , publish
        , destroy
        , has
        , getApp
        , isEmpty
        , list
        , reset
    }
} // visualController



export default VisualController
