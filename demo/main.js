import VisualController from '/src/main.js'
import HeaderApp from '/demo/header.svelte'
import SidebarApp from '/demo/sidebar.svelte'

const
      html              = new VisualController({})
    , main              = document.getElementById ( 'main' )
    , updateHeaderBtn   = document.getElementById ( 'updateHeader' )
    , incrementBtn      = document.getElementById ( 'incrementHeader' )
    , swapBtn           = document.getElementById ( 'swapApps' )
    , destroyHeaderBtn  = document.getElementById ( 'destroyHeader' )
    , destroySidebarBtn = document.getElementById ( 'destroySidebar' )
    , resetBtn          = document.getElementById ( 'resetAll' )
    , resultText        = document.getElementById ( 'resultText' )
    , aliasesList       = document.getElementById ( 'aliasesList' )
    ;

function refreshAliases () {
        aliasesList.textContent = html.list ().join ( ', ' ) || '-'
    }


// Apps move between aliases on swap, so the header/sidebar controls can't be
// hardcoded to 'header' / 'sidebar' aliases. Instead, find the alias that
// hosts the app exposing a marker method unique to it. HeaderApp is the only
// one with `increment`; SidebarApp is the only one with `setFilter`.
function findApp ( marker ) {
        for ( const alias of html.list() ) {
            const app = html.getApp ( alias )
            if ( app && typeof app[marker] === 'function' )   return { alias, app }
        }
        return null
    }


// 1. Define two regions inside one parent. No <div id="..."> wrappers.
html.set ( ( { start, end } ) => {
        main.append ( start, end )
        return 'header'
    })

html.set ( ( { start, end } ) => {
        main.append ( start, end )
        return 'sidebar'
    })

refreshAliases ()


// 2. Publish apps into the regions.
html.publish ( 'header', HeaderApp )
    .then ( updates => {
            resultText.textContent = 'Header published: ' + JSON.stringify ( Object.keys ( updates ) )
            refreshAliases ()
        })

html.publish ( 'sidebar', SidebarApp, { title: 'Items' } )
    .then ( updates => {
            console.log ( 'Sidebar published:', updates )
            refreshAliases ()
        })



updateHeaderBtn.addEventListener ( 'click', () => {
        const found = findApp ( 'changeMessage' )
        if ( found )   found.app.changeMessage ( `Header updated at ${new Date().toLocaleTimeString()}` )
    })

incrementBtn.addEventListener ( 'click', () => {
        const found = findApp ( 'increment' )
        if ( found )   found.app.increment ()
    })


let swapped = false
swapBtn.addEventListener ( 'click', () => {
        swapped = !swapped
        // Exchange the apps between the two regions. Initial state:
        // header hosts HeaderApp, sidebar hosts SidebarApp. After swap,
        // header hosts SidebarApp and sidebar hosts HeaderApp. Toggle again
        // to restore.
        const [ headerApp, sidebarApp ] = swapped
                ? [ SidebarApp, HeaderApp ]
                : [ HeaderApp, SidebarApp ]
        html.publish ( 'header', headerApp )
        html.publish ( 'sidebar', sidebarApp )
        resultText.textContent = swapped
                ? 'Swapped: header and sidebar exchanged apps'
                : 'Restored: header and sidebar back to initial apps'
    })


destroyHeaderBtn.addEventListener ( 'click', () => {
        const found = findApp ( 'changeMessage' )
        if ( found ) {
            const ok = html.destroy ( found.alias )
            resultText.textContent = 'Destroy header: ' + ok
            refreshAliases ()
        } else {
            resultText.textContent = 'Destroy header: no app to destroy'
        }
    })


destroySidebarBtn.addEventListener ( 'click', () => {
        const found = findApp ( 'setFilter' )
        if ( found ) {
            const ok = html.destroy ( found.alias )
            resultText.textContent = 'Destroy sidebar: ' + ok
            refreshAliases ()
        } else {
            resultText.textContent = 'Destroy sidebar: no app to destroy'
        }
    })


resetBtn.addEventListener ( 'click', () => {
        html.reset ()
        resultText.textContent = 'Reset all'
        refreshAliases ()
    })
