<script>
  import ToDoList from '$lib/components/ToDoList.svelte';

  let todoItem = $state('');
  let todsList = $state([]);
  function addToods() {
    if (todoItem.trim() === '') {
      return;
    }
    todsList = [
  ...todsList,
  { id: Date.now(), text: todoItem, completed: false }
];
    todoItem = '';
  }
  function deleteTodo(id) {
    todsList = todsList.filter(todo => todo.id !== id);
  }
function toggleTodo(id) {
  todsList = todsList.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
}
function archiveCompleted() {
  todsList = todsList.filter(todo => !todo.completed);
}

</script>
<button onclick={archiveCompleted} disabled={!todsList.some(todo => todo.completed)}>
    archive completed
</button>
<input
  type="text"
  placeholder="Enter new todo here"
  bind:value={todoItem}
/>
<button onclick={addToods}>Add Todo</button>
{#if todsList.length === 0}
  <p>No todos available. Please add some tasks!</p>
{:else}
  <ToDoList {todsList} {deleteTodo} {toggleTodo}/>
{/if}
