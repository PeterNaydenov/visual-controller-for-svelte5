"use strict"
import askForPromise from "ask-for-promise"
import { mount, unmount } from 'svelte'

/**
 *  Visual Controller for Svelte 5
 *  Controls multiple svelte 5 apps with a single controller
 */


class VisualController {

  constructor ( dependencies ) {
        const cache = {} // collect svelte components
        return {
            publish : this.publish ( dependencies, cache ),
            destroy : this.destroy ( cache ),
            getApp  : this.getApp ( cache ),
            has     : id => cache.hasOwnProperty ( id )
          }
    } // constructor


    
  publish ( dependencies, cache ) {
      return function ( Component, data, id ) {
                const 
                      hasKey = cache.hasOwnProperty ( id )
                    , endTask = askForPromise ()
                    ;

                if ( !Component ) {
                          console.error ( 'Error: Component is undefined' )
                          endTask.done ( false )
                          return endTask.promise
                    }

                if ( hasKey )   unmount (cache[ id ])
                
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
        }} // publish func.



  destroy ( cache ) {
      return function destroy ( id ) {
                if ( cache[id] ) {
                          let item = cache[id];
                          unmount ( item )
                          delete cache[id]
                          return true
                     }
                else      return false
        }} // destroy func.



  getApp ( cache ) {
    return function ( id ) {
            const item = cache[id];
            if (!item ) {
                    console.error ( `App with id: "${id}" was not found` )
                    return false
                }
            return item['updates']
    }} // getApp func.

} // VisualController


export default VisualController


