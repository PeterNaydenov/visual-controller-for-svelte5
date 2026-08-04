<script>
  let { title = 'Sidebar', dependencies, setupUpdates } = $props()

  let items = $state([ 'Apples', 'Oranges', 'Pears' ])
  let filter = $state('')

  function addItem ( name ) {
        if ( name )   items.push ( name )
    }

  function removeItem ( idx ) {
        items.splice ( idx, 1 )
    }

  function setFilter ( text ) {
        filter = text
    }

  const visible = $derived (
        items.filter ( i => i.toLowerCase().includes ( filter.toLowerCase() ) )
    )

  setupUpdates ({ addItem, removeItem, setFilter })
</script>

<div class="hello">
  <h3>{title}</h3>
  <input
        value={filter}
        oninput={( e ) => setFilter ( e.currentTarget.value )}
        placeholder="filter..."
  />
  <ul>
    {#each visible as item, idx (item)}
      <li>
        {item}
        <button onclick={() => removeItem ( idx )}>x</button>
      </li>
    {/each}
  </ul>
</div>

<style>
  .hello { padding: 10px; background: #fff8e1; border-radius: 4px; }
  .hello h3 { margin: 0 0 10px; }
  .hello ul { padding-left: 20px; margin: 5px 0; }
  .hello li { margin: 2px 0; }
  .hello button { margin-left: 5px; }
  .hello input { margin-bottom: 5px; padding: 2px 4px; width: 100%; box-sizing: border-box; }
</style>
