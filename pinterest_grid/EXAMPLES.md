# Usage Examples

## Basic Setup

### 1. Simple Masonry Grid

The simplest way to get started with a masonry grid:

```typescript
import { MasonryLayout } from './components';
import { Pin } from './types';

export function BasicExample() {
  const pins: Pin[] = [
    {
      id: '1',
      title: 'Beautiful Sunset',
      imageUrl: 'https://picsum.photos/300/250',
      imageHeight: 250,
      imageWidth: 300,
      createdAt: new Date().toISOString(),
      likes: 1234,
    },
    // ... more pins
  ];

  return (
    <MasonryLayout
      items={pins}
      columnCount={5}
      gap={16}
    />
  );
}
```

### 2. With Infinite Scroll

Add automatic loading of more items:

```typescript
import { useState, useCallback } from 'react';
import { MasonryLayout } from './components';
import { useInfiniteScroll } from './hooks';
import apiService from './services/api';

export function InfiniteScrollExample() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [cursor, setCursor] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);

  const handleLoadMore = useCallback(async () => {
    const response = await apiService.fetchFeed(20, cursor);
    setPins(prev => [...prev, ...response.pins]);
    setCursor(response.nextCursor);
    setHasMore(response.hasMore);
  }, [cursor]);

  const observerTarget = useInfiniteScroll(handleLoadMore);

  return (
    <>
      <MasonryLayout items={pins} columnCount={5} gap={16} />
      <div ref={observerTarget} className="h-10" />
    </>
  );
}
```

### 3. Responsive Design

Auto-adjust columns based on screen size:

```typescript
import { useResponsiveColumns } from './hooks';
import { MasonryLayout } from './components';

export function ResponsiveExample() {
  const columnCount = useResponsiveColumns();

  return (
    <MasonryLayout
      items={pins}
      columnCount={columnCount}
      gap={16}
    />
  );
}
```

### 4. Complete Page Example

Full example with header, error handling, and loading states:

```typescript
import { useState, useEffect, useCallback } from 'react';
import { Header, MasonryLayout } from './components';
import { useInfiniteScroll, useResponsiveColumns, usePagination } from './hooks';
import apiService from './services/api';
import { Pin } from './types';

export function CompletePageExample() {
  // State
  const [pins, setPins] = useState<Pin[]>([]);
  const [error, setError] = useState<string | null>(null);
  const pagination = usePagination(20);
  const columnCount = useResponsiveColumns();

  // Fetch handler
  const fetchPins = useCallback(async () => {
    try {
      pagination.setLoading(true);
      const response = await apiService.fetchFeed(
        20,
        pagination.cursor
      );

      if (pagination.page === 0) {
        setPins(response.pins);
      } else {
        setPins(prev => [...prev, ...response.pins]);
      }

      pagination.fetchMore(response.nextCursor, response.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      pagination.setLoading(false);
    }
  }, [pagination]);

  // Initial load
  useEffect(() => {
    if (pins.length === 0) {
      fetchPins();
    }
  }, []);

  // Infinite scroll
  const observerTarget = useInfiniteScroll(
    () => {
      if (!pagination.isLoading && pagination.hasMore) {
        fetchPins();
      }
    },
    { rootMargin: '200px' }
  );

  // Search handler
  const handleSearch = useCallback((query: string) => {
    pagination.reset();
    setPins([]);
    // Implement search logic
  }, [pagination]);

  return (
    <>
      <Header onSearch={handleSearch} />

      {error && (
        <div className="bg-red-50 p-4 m-4 rounded-lg">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-sm text-red-600"
          >
            Dismiss
          </button>
        </div>
      )}

      <MasonryLayout
        items={pins}
        columnCount={columnCount}
        gap={16}
        isLoading={pagination.isLoading && pagination.page === 0}
      />

      <div ref={observerTarget} className="h-10" />
    </>
  );
}
```

---

## Advanced Examples

### 5. Custom Pin Card Styling

Override default pin card appearance:

```typescript
import PinCard from './components/PinCard';
import { Pin } from './types';

interface CustomPinProps {
  pin: Pin;
}

function CustomPin({ pin }: CustomPinProps) {
  return (
    <div className="custom-pin rounded-3xl overflow-hidden">
      <img
        src={pin.imageUrl}
        alt={pin.title}
        className="w-full h-auto object-cover"
      />
      <div className="custom-overlay">
        <h3 className="text-white font-bold">{pin.title}</h3>
        <p className="text-gray-200 text-sm">{pin.description}</p>
      </div>
    </div>
  );
}

// Usage in MasonryLayout
columns.map(col => (
  <div key={col.id}>
    {col.items.map(pin => (
      <CustomPin key={pin.id} pin={pin} />
    ))}
  </div>
))
```

### 6. Search & Filter

Implement search with real-time filtering:

```typescript
function SearchExample() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Pin[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await apiService.fetchFeed(
        50,
        undefined,
        { search: query }
      );
      setResults(response.pins);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      <input
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          handleSearch(e.target.value);
        }}
        placeholder="Search pins..."
      />

      {isSearching && <LoadingSpinner />}

      <MasonryLayout
        items={results}
        columnCount={5}
        gap={16}
      />
    </>
  );
}
```

### 7. Board Management (Save Pins)

Save pins to specific boards:

```typescript
function BoardManagementExample() {
  const [boards, setBoards] = useState<Board[]>([]);

  const handleSavePin = async (pinId: string, boardId: string) => {
    try {
      await apiService.savePin(pinId, boardId);

      // Show success toast
      toast.success(`Saved to board!`);

      // Update UI if needed
    } catch (error) {
      toast.error('Failed to save pin');
    }
  };

  return (
    <div>
      {/* Board Selector */}
      <div className="board-selector">
        {boards.map(board => (
          <button
            key={board.id}
            onClick={() => handleSavePin(pinId, board.id)}
          >
            {board.name}
          </button>
        ))}
      </div>

      {/* Masonry with pins */}
      <MasonryLayout items={pins} columnCount={5} gap={16} />
    </div>
  );
}
```

### 8. Category Filtering

Filter pins by category:

```typescript
function CategoryFilterExample() {
  const [category, setCategory] = useState('all');
  const [pins, setPins] = useState<Pin[]>([]);

  const handleCategoryChange = async (newCategory: string) => {
    setCategory(newCategory);
    const response = await apiService.fetchFeed(
      20,
      undefined,
      { category: newCategory !== 'all' ? newCategory : undefined }
    );
    setPins(response.pins);
  };

  return (
    <>
      <div className="category-tabs">
        {['all', 'photography', 'design', 'travel'].map(cat => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={category === cat ? 'active' : ''}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <MasonryLayout
        items={pins}
        columnCount={5}
        gap={16}
      />
    </>
  );
}
```

### 9. Like/Unlike Pins

Handle pin interactions:

```typescript
function InteractivePin() {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(pin.likes);

  const handleLike = async () => {
    try {
      const result = await apiService.likePin(pin.id);
      setIsLiked(true);
      setLikeCount(result.likes);
    } catch (error) {
      console.error('Failed to like pin');
    }
  };

  const handleUnlike = async () => {
    try {
      // Assume API has unlike method
      const result = await apiService.unlikePin(pin.id);
      setIsLiked(false);
      setLikeCount(result.likes);
    } catch (error) {
      console.error('Failed to unlike pin');
    }
  };

  return (
    <button
      onClick={isLiked ? handleUnlike : handleLike}
      className={`like-btn ${isLiked ? 'liked' : ''}`}
    >
      ❤️ {likeCount}
    </button>
  );
}
```

### 10. Dark Mode Support

Add dark mode to the layout:

```typescript
function DarkModeExample() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className={isDarkMode ? 'dark' : 'light'}>
      <button onClick={() => setIsDarkMode(!isDarkMode)}>
        Toggle Dark Mode
      </button>

      <MasonryLayout
        items={pins}
        columnCount={columnCount}
        gap={16}
      />
    </div>
  );
}

// CSS
const styles = `
  .light {
    background: white;
    color: black;
  }

  .dark {
    background: #1a1a1a;
    color: white;
  }

  .dark .card {
    background: #2a2a2a;
    border: 1px solid #3a3a3a;
  }
`;
```

---

## Performance Optimization Examples

### 11. Image Lazy Loading

Optimize image loading:

```typescript
import { lazy, Suspense } from 'react';

const ImageWithSkeleton = ({ src, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {!isLoaded && (
        <div className="skeleton h-full bg-gray-200 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={isLoaded ? 'visible' : 'invisible'}
      />
    </>
  );
};
```

### 12. Virtualization for Large Lists

Handle thousands of pins efficiently:

```typescript
import { FixedSizeList } from 'react-window';

function VirtualizedMasonry({ items }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={300}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <img src={items[index].imageUrl} />
        </div>
      )}
    </FixedSizeList>
  );
}
```

### 13. Request Caching

Avoid redundant API calls:

```typescript
const fetchWithCache = (() => {
  const cache = new Map();

  return async (key, fetcher) => {
    if (cache.has(key)) {
      return cache.get(key);
    }

    const promise = fetcher().then(data => {
      cache.set(key, data);
      return data;
    });

    return promise;
  };
})();

// Usage
const pins = await fetchWithCache(
  'feed-page-1',
  () => apiService.fetchFeed(20, undefined)
);
```

---

## Testing Examples

### 14. Unit Test

Test the layout calculation:

```typescript
import { render } from '@testing-library/react';
import { MasonryLayout } from './components';

describe('MasonryLayout', () => {
  it('renders all pins', () => {
    const pins = Array(6).fill(null).map((_, i) => ({
      id: `pin-${i}`,
      title: `Pin ${i}`,
      imageUrl: 'https://picsum.photos/300/250',
      imageHeight: 250,
      imageWidth: 300,
      createdAt: new Date().toISOString(),
      likes: 0,
    }));

    const { container } = render(
      <MasonryLayout items={pins} columnCount={3} gap={16} />
    );

    expect(container.querySelectorAll('img')).toHaveLength(6);
  });

  it('adapts to column count', () => {
    const { rerender } = render(
      <MasonryLayout items={pins} columnCount={5} gap={16} />
    );

    rerender(
      <MasonryLayout items={pins} columnCount={3} gap={16} />
    );

    // Layout should update
  });
});
```

---

## Common Patterns Summary

| Pattern | Use Case | Complexity |
|---------|----------|-----------|
| Basic Grid | Simple pin display | ✅ Easy |
| + Infinite Scroll | Load more on scroll | ✅ Easy |
| + Responsive | Mobile to desktop | ✅ Easy |
| + Full Page | Production app | ⚠️ Medium |
| + Search/Filter | Query-based display | ⚠️ Medium |
| + Interactions | Like, save, share | ⚠️ Medium |
| + Virtual Scroll | 1000+ items | ❌ Hard |
| + Dark Mode | Theme selection | ❌ Hard |

---

**Ready to build?** Start with example #4 (CompletePageExample) and customize from there! 🚀
