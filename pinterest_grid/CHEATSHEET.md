# Masonry Layout Implementation Cheatsheet

## Quick Reference

### Algorithm at a Glance

```typescript
// The Core Logic
const layoutItems = (items, columnCount, gap) => {
  const columns = Array(columnCount).fill(null).map(() => ({
    items: [],
    height: 0,
  }));

  items.forEach(item => {
    // 1. Find shortest column
    const shortest = columns.reduce((min, col, idx) =>
      col.height < columns[min].height ? idx : min,
      0
    );

    // 2. Add item to shortest column
    columns[shortest].items.push(item);

    // 3. Update height
    columns[shortest].height += item.height + gap;
  });

  return columns;
};
```

**Total Time**: O(n × m) where n=items, m=columns  
**Total Space**: O(m)

---

## Implementation Patterns

### Pattern 1: React Component (Recommended)

```typescript
// MasonryLayout.tsx
const MasonryLayout = ({ items, columnCount = 5, gap = 16 }) => {
  // Memoize layout calculation
  const columns = useMemo(() => {
    const cols = Array.from({ length: columnCount }, () => ({
      items: [],
      height: 0,
    }));

    items.forEach(item => {
      const shortestIdx = cols.reduce(
        (min, _, idx) => cols[idx].height < cols[min].height ? idx : min,
        0
      );

      cols[shortestIdx].items.push(item);
      cols[shortestIdx].height += item.height + gap;
    });

    return cols;
  }, [items, columnCount, gap]);

  return (
    <div className="grid" style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}>
      {columns.map((col, i) => (
        <div key={i}>
          {col.items.map(item => (
            <ItemComponent key={item.id} item={item} />
          ))}
        </div>
      ))}
    </div>
  );
};
```

### Pattern 2: Plain JavaScript

```typescript
class MasonryLayout {
  constructor(columnCount = 5, gap = 16) {
    this.columnCount = columnCount;
    this.gap = gap;
    this.columns = [];
  }

  layout(items) {
    // Initialize columns
    this.columns = Array.from(
      { length: this.columnCount },
      () => ({ items: [], height: 0 })
    );

    // Distribute items
    items.forEach(item => {
      const minIdx = this.columns.reduce(
        (min, col, idx) =>
          col.height < this.columns[min].height ? idx : min,
        0
      );

      this.columns[minIdx].items.push(item);
      this.columns[minIdx].height += item.height + this.gap;
    });

    return this.columns;
  }

  renderHTML() {
    return this.columns
      .map(
        col =>
          `<div>${col.items.map(item => `<div>${item.html}</div>`).join('')}</div>`
      )
      .join('');
  }
}

// Usage
const layout = new MasonryLayout(5, 16);
const columns = layout.layout(items);
document.body.innerHTML = layout.renderHTML();
```

### Pattern 3: CSS Grid (No JS Calculation)

```html
<div class="masonry">
  <div class="item">1</div>
  <div class="item">2</div>
  <!-- ... -->
</div>

<style>
.masonry {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

/* Items arrange automatically */
</style>
```

---

## Responsive Implementation

### Adaptive Columns Hook

```typescript
const useResponsiveColumns = (baseColumns = 5) => {
  const [columns, setColumns] = useState(baseColumns);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 480) setColumns(1);
      else if (width < 768) setColumns(2);
      else if (width < 1024) setColumns(3);
      else if (width < 1440) setColumns(4);
      else setColumns(5);
    };

    handleResize(); // Initial
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return columns;
};
```

### Responsive Grid CSS

```css
/* Mobile: 1 column */
@media (max-width: 639px) {
  .masonry { grid-template-columns: 1fr; }
}

/* Tablet: 2 columns */
@media (min-width: 640px) and (max-width: 1023px) {
  .masonry { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop: 3+ columns */
@media (min-width: 1024px) {
  .masonry { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
}
```

---

## Common Issues & Solutions

### Issue 1: Items Not Balancing Evenly

**Problem**: One column is much taller than others

**Cause**: Heavy items added early fill one column

**Solution**:
```typescript
// Sort by height before distribution
const sortedItems = [...items].sort((a, b) => b.height - a.height);
const columns = layout(sortedItems, columnCount, gap);
```

**Result**: More even distribution

### Issue 2: Layout Jumpiness

**Problem**: Content shifts as images load

**Solution**: Reserve space with aspect ratio
```tsx
<div style={{ paddingBottom: '100%', position: 'relative' }}>
  <img style={{ position: 'absolute' }} src={...} />
</div>
```

### Issue 3: Holes/Gaps at Bottom

**Problem**: Empty space below shorter items

**Note**: This is normal with greedy algorithm. To fix:
```typescript
// Increase gap or reduce item spacing
// Implement more sophisticated algorithm (expensive)
// Accept as-is (Pinterest does)
```

### Issue 4: Mobile Not Responsive

**Problem**: Still showing 5 columns on mobile

**Solution**:
```typescript
// Ensure useResponsiveColumns is called
const columns = useResponsiveColumns();

// Or manually trigger in effect
useEffect(() => {
  window.dispatchEvent(new Event('resize'));
}, []);
```

---

## Performance Benchmarks

### Implementation Comparison

| Approach | 100 items | 1000 items | 10k items |
|----------|-----------|-----------|-----------|
| Greedy | < 1ms | 2-5ms | 50-100ms |
| Optimal | 5-10ms | 100-500ms | > 1s ❌ |
| CSS Grid | 0ms | 0ms | 0ms ✅ |
| Virtual Scroll | < 1ms | < 1ms | < 1ms ✅ |

### Optimization Techniques

```typescript
// Technique 1: Memoization (saves 50-70%)
const columns = useMemo(() => {
  return layout(items, columnCount, gap);
}, [items, columnCount, gap]);

// Technique 2: Request Deduplication (saves 100%)
const cache = new Map();
const fetch = (key) => cache.get(key) || api.call();

// Technique 3: Lazy Image Loading (saves bandwidth)
<img loading="lazy" src={...} />

// Technique 4: Virtualization (saves 99% for large lists)
// Only render visible items
```

---

## Testing Examples

### Unit Test: Layout Algorithm

```typescript
describe('Masonry Layout', () => {
  it('distributes items across columns', () => {
    const items = [
      { id: 1, height: 200 },
      { id: 2, height: 250 },
      { id: 3, height: 200 },
    ];

    const columns = layout(items, 2, 16);

    expect(columns).toHaveLength(2);
    expect(columns[0].items).toContainEqual({ id: 1, height: 200 });
    expect(columns[1].items).toContainEqual({ id: 2, height: 250 });
  });

  it('balances column heights', () => {
    const items = Array(10).fill(null).map((_, i) => ({
      id: i,
      height: 200,
    }));

    const columns = layout(items, 5, 0);

    // Each column should have ~2 items
    columns.forEach(col => {
      expect(col.items.length).toBe(2);
    });
  });

  it('handles empty items', () => {
    const columns = layout([], 5, 16);
    expect(columns).toHaveLength(5);
    expect(columns.every(c => c.items.length === 0)).toBe(true);
  });

  it('respects gap parameter', () => {
    const items = [{ id: 1, height: 200 }];
    const columns = layout(items, 1, 20);
    expect(columns[0].height).toBe(220); // 200 + 20
  });
});
```

### Integration Test: Component

```typescript
describe('MasonryLayout Component', () => {
  it('renders all items', () => {
    const items = Array(6).fill(null).map((_, i) => ({
      id: i,
      height: 200,
      imageUrl: `https://example.com/${i}.jpg`,
    }));

    const { getByTestId } = render(
      <MasonryLayout items={items} columnCount={3} gap={16} />
    );

    expect(getByTestId('item-0')).toBeInTheDocument();
    expect(getByTestId('item-5')).toBeInTheDocument();
  });

  it('adapts to column count changes', () => {
    const { rerender } = render(
      <MasonryLayout items={items} columnCount={5} gap={16} />
    );

    rerender(
      <MasonryLayout items={items} columnCount={3} gap={16} />
    );

    // Layout should recalculate
  });
});
```

---

## Interview Whiteboard Session Outline

### Phase 1: Clarification (2 min)
```
Q: How many pins on page load?
A: ~20-30

Q: What happens on scroll?
A: Load more items (infinite scroll)

Q: Screen sizes to support?
A: Mobile to 5K resolution

Q: Item height variation?
A: 150-400px range

Q: Performance requirements?
A: 60 FPS scrolling
```

### Phase 2: High-Level Design (3 min)
```
Draw boxes:
HomePage
  ├── Header
  ├── MasonryLayout
  │   ├── Column 1
  │   ├── Column 2
  │   └── Column 3
  └── InfiniteScroll Trigger
```

### Phase 3: Algorithm (5 min)
```
Greedy approach:
1. Track column heights
2. For each item, find shortest
3. Add item to shortest
4. Update height

Time: O(n × m)
Space: O(m)
```

### Phase 4: Implementation (10 min)
```typescript
// Write pseudocode then real code
const layout = (items, cols, gap) => {
  const columns = Array(cols).fill({
    items: [],
    height: 0,
  });

  items.forEach(item => {
    const min = columns.reduce(
      (idx, _, i) =>
        columns[i].height < columns[idx].height ? i : idx,
      0
    );
    columns[min].items.push(item);
    columns[min].height += item.height + gap;
  });

  return columns;
};
```

### Phase 5: Optimization (5 min)
```
- Memoization (prevent recalc)
- Image lazy loading
- Infinite scroll (Intersection Observer)
- Responsive columns
- Request deduplication
```

### Phase 6: Edge Cases (5 min)
```
- 0 items (show empty state)
- 1 item (use 1 column)
- Unknown image heights (use skeleton)
- Slow network (show loading)
- Resize window (recalculate columns)
```

---

## Quick Copy-Paste Components

### Simple Masonry in 30 lines

```typescript
import { useMemo } from 'react';

export default function Masonry({ items = [], cols = 3 }) {
  const columns = useMemo(() => {
    const c = Array(cols).fill(null).map(() => ({ items: [], h: 0 }));
    items.forEach(item => {
      const min = c.reduce((i, _, idx) => c[idx].h < c[i].h ? idx : i, 0);
      c[min].items.push(item);
      c[min].h += item.height + 16;
    });
    return c;
  }, [items, cols]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16 }}>
      {columns.map((col, i) => (
        <div key={i}>
          {col.items.map(item => (
            <img key={item.id} src={item.url} height={item.height} />
          ))}
        </div>
      ))}
    </div>
  );
}
```

### With Responsive Columns

```typescript
export default function ResponsiveMasonry({ items = [] }) {
  const [cols, setCols] = useState(5);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setCols(w < 640 ? 1 : w < 1024 ? 2 : w < 1440 ? 3 : w < 1920 ? 4 : 5);
    };
    update();
    const timer = setTimeout(() => window.addEventListener('resize', update), 0);
    return () => window.removeEventListener('resize', update);
  }, []);

  return <Masonry items={items} cols={cols} />;
}
```

### With Infinite Scroll

```typescript
export default function InfiniteScroll({ onLoad }) {
  const ref = useRef();

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && onLoad(),
      { rootMargin: '200px' }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [onLoad]);

  return <div ref={ref} />;
}

// Usage
const [items, setItems] = useState([]);
const handleLoadMore = () => fetch('/api/pins').then(d => setItems(p => [...p, ...d]));

<>
  <ResponsiveMasonry items={items} />
  <InfiniteScroll onLoad={handleLoadMore} />
</>
```

---

## Resources for Further Learning

### Articles
- [CSS Grid Masonry](https://web.dev/min-max-css/)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [React Performance](https://react.dev/reference/react/useState#putting-a-series-of-state-updates-into-a-queue)

### Repos
- [react-window](https://github.com/bvaughn/react-window) - Virtual scrolling
- [react-masonry-css](https://github.com/paulcollett/react-masonry-css) - CSS masonry
- [react-infinite-scroll-component](https://github.com/ankeetmaini/react-infinite-scroll-component)

### Tools
- [Profiler.measureUserAgentSpecificMemory()](https://developer.chrome.com/docs/devtools/memory-problems/) - Memory profiling
- [Chrome Performance Tab](https://developer.chrome.com/docs/devtools/performance/) - Performance profiling

---

**Master the masonry layout and ace your interview!** 🚀
