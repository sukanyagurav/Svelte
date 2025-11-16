<script>
  let { todsList,deleteTodo,toggleTodo } = $props();
</script>

<ul>
  {#each todsList as todo (todo.id)}
    <li>
      <input
        type="checkbox"
        bind:checked={todo.completed}
        onchange={()=>toggleTodo(todo)} 
      />
      <span class:completed={todo.completed} style={todo.completed ? 'text-decoration: line-through' : ''}>{todo.text}</span>
      <button onclick={()=>deleteTodo(todo.id)}>Delete</button>
    </li>
  {/each}
</ul>
