<script lang="ts">
  import BookCard from './lib/BookCard.svelte';
  import { books } from './lib/books';
  import type { Book } from './lib/types';

  type TabType = 'All' | 'Reading' | 'Wishlist' | 'Purchased';

  let activeTab: TabType = 'Reading';

  $: filteredBooks = activeTab === 'All' 
    ? books 
    : books.filter(book => book.status === activeTab.toLowerCase());

  const tabs: TabType[] = ['Reading', 'Wishlist', 'Purchased', 'All'];
</script>

<div class="min-h-screen bg-gradient-to-b from-teal-700 to-teal-800">
  <!-- Header -->
  <header class="bg-teal-700 text-white p-4 flex items-center justify-between shadow-md">
    <button class="text-2xl">←</button>
    <h1 class="text-xl font-semibold">My Design Books</h1>
    <button class="text-2xl">☰</button>
  </header>

  <!-- Tabbed Navigation -->
  <nav class="bg-teal-600 text-white flex gap-2 p-4 overflow-x-auto">
    {#each tabs as tab}
      <button
        on:click={() => activeTab = tab}
        class="px-4 py-2 whitespace-nowrap rounded transition-colors"
        class:border-b-2={activeTab === tab}
        class:border-white={activeTab === tab}
        class:bg-teal-500={activeTab === tab}
        class:hover:bg-teal-500={activeTab !== tab}
      >
        {tab}
      </button>
    {/each}
  </nav>

  <!-- Main Content -->
  <main class="p-6 max-w-7xl mx-auto">
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {#each filteredBooks as book (book.id)}
        <BookCard {book} />
      {/each}
    </div>

    {#if filteredBooks.length === 0}
      <div class="text-center py-12 text-white">
        <p class="text-lg">No books in this category</p>
      </div>
    {/if}
  </main>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }
</style>
