# Visual Controller for Svelte 5 (@peter.naydenov/visual-controller-svelte5)

![version](https://img.shields.io/github/package-json/v/peterNaydenov/visual-controller-for-svelte5)
![license](https://img.shields.io/github/license/peterNaydenov/visual-controller-for-svelte5)



Tool for building a micro-frontends(MFE) based on Svelte 5 components - Start multiple Svelte 5 applications in the same HTML page and control them.

Install visual controller:
```
npm i @peter.naydenov/visual-controller-for-svelte5
```

Initialization process:
```js
// for es6 module projects:
import notice from '@peter.naydenov/notice' // event emitter by your personal choice.
import VisualController from '@peter.naydenov/visual-controller-for-svelte5'


let 
      eBus = notice ()
    , dependencies = { eBus }  // Provide everything that should be exposed to components 
    , html = new VisualController ( dependencies ) 
    ;
// Ready for use...
```

Let's show something on the screen:
```js
// Let's have svelte 5 component 'Hello' with prop 'greeting'

html.publish ( Hello, {greeting:'Hi'}, 'app' )
//arguments are: ( component, props, containerID )
```

## Inside of the Components

*Note: If your component should be displayed only, that section can be skipped.*

All provided libraries during visualController initialization are available if you export variable with name `dependencies`. Export also `setupUpdates` if you need to manipulate component from outside.

```js

let msg = 'Vite + Svelte'
export let dependencies, setupUpdates;
const { eBus } = dependencies

setupUpdates ({   // Provides to visualContoller method 'changeMessage' 
          changeMessage (update) {
                  msg = update
              }
    })
```

The external call will look like this:

```js
html.getApp ( 'app' ).changeMessage ( 'New message content' )
```




## Visual Controller Methods
```js
  publish : 'Render svelte app in container. Associate app instance with the container.'
, getApp  : 'Returns app instance by container name'
, destroy : 'Destroy app by using container name '
, has     : 'Checks if app with specific "id" was published'
```



### VisualController.publish ()
Publish a svelte 5 app.
```js
html.publish ( component, props, containerID )
```
- **component**: *object*. Svelte 5 component
- **props**: *object*. Svelte components props
- **containerID**: *string*. Id of the container where svelte-app will live.
- **returns**: *Promise<Object>*. Update methods library if defined. Else will return a empty object;

Example:
```js
 let html = new VisualController ();
 html.publish ( Hi, { greeting: 'hi'}, 'app' )
```

Render component 'Hi' with prop 'greeting' and render it in html element with id "app".





### VisualController.getApp ()
Returns the library of functions provided from method `setupUpdates`. If svelte-app never called `setupUpdates`, result will be an empty object.

```js
 let controls = html.getApp ( containerID )
```
- **containerID**: *string*. Id of the container.

Example:
```js
let 
      id = 'videoControls'
    , controls = html.getApp ( id )
    ;
    // if app with 'id' doesn't exist -> returns false, 
    // if app exists and 'setupUpdates' was not used -> returns {}
    // in our case -> returns { changeMessage:f }
if ( !controls )   console.error ( `App for id:"${id}" is not available` )
else {
        if ( controls.changeMessage )   controls.changeMessage ('new title') 
   }
```
If visual controller(html) has a svelte app associated with this name will return it. Otherwise will return **false**.





### VisualController.destroy ()
Will destroy svelte app associated with this container name and container will become empty. Function will return 'true' on success and 'false' on failure. 
Function will not delete content of provided container if there is no svelte app associated with it.

```js
html.destroy ( containerID )
```
- **containerID**: *string*. Id name.





### Extra

Visual Controller has versions for few other front-end frameworks:
- [Svelte 4](https://github.com/PeterNaydenov/visual-controller-for-svelte3)
- [React](https://github.com/PeterNaydenov/visual-controller-for-react) 
- [Vue 3](https://github.com/PeterNaydenov/visual-controller-for-vue3)
- [Vue 2](https://github.com/PeterNaydenov/visual-controller-for-vue)





## Links

- [History of changes](https://github.com/PeterNaydenov/visual-controller-for-svelte5/blob/master/Changelog.md)
- [License](https://github.com/PeterNaydenov/visual-controller-for-svelte5/blob/master/LICENSE)



## Credits
'visual-controller-for-svelte5' is created and supported by Peter Naydenov



## License

'visual-controller-for-svelte5' is released under the [MIT license](https://github.com/PeterNaydenov/visual-controller-for-svelte5/blob/master/LICENSE)