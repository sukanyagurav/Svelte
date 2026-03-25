<script lang="ts">
  import type { Book } from './types';

  export let book: Book;
</script>

<div class="flex flex-col items-center gap-2">
  <div class="w-full aspect-[3/4] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
    <img
      src={book.cover}
      alt={book.title}
      class="w-full h-full object-cover"
    />
  </div>
  <h3 class="text-center font-semibold text-sm line-clamp-2">{book.title}</h3>
  <p class="text-center text-xs text-gray-600 line-clamp-1">{book.author}</p>
</div>
