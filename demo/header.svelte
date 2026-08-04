<script>
  let { greeting = 'Hello from Header!', dependencies, setupUpdates } = $props()

  let message = $state(greeting)
  let count = $state(0)

  function changeMessage ( newMsg ) {
        message = newMsg
    }

  function increment () {
        count += 1
    }

  function getCount () {
        return count
    }

  setupUpdates ({ changeMessage, increment, getCount })
</script>

<div class="hello">
  <h3>{message}</h3>
  <p>Count: {count}</p>
  <button onclick={increment}>Increment</button>
</div>

<style>
  .hello { padding: 10px; background: #f0f0f0; border-radius: 4px; }
  .hello h3 { margin: 0 0 10px; }
  .hello button { margin-right: 5px; }
</style>
