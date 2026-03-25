# System Design: Pinterest Masonry Layout - Interview Guide

## Table of Contents
1. [Problem Statement](#problem-statement)
2. [Requirements](#requirements)
3. [Design Approaches](#design-approaches)
4. [Deep Dive: Greedy Algorithm](#deep-dive-greedy-algorithm)
5. [Architecture](#architecture)
6. [Code Implementation](#code-implementation)
7. [Optimization Strategies](#optimization-strategies)
8. [Trade-offs Analysis](#trade-offs-analysis)
9. [Common Interview Questions](#common-interview-questions)

---

## Problem Statement

### What are we building?
Design a Pinterest-like homepage with a **masonry grid layout** that:
1. Displays multiple items (pins) in a visually balanced grid
2. Adapts to different screen sizes (responsive)
3. Loads more items as user scrolls (infinite scroll)
4. Handles interactions (like, save, share)
5. Provides smooth animations and good UX

### Why is masonry layout important?
- **Visual Appeal**: Fills screen space efficiently without excessive white space
- **Content Density**: Shows more content in less vertical space
- **Flexibility**: Works with varying content heights (short pins & tall pins)
- **User Engagement**: Encourages exploration by keeping pins visible

---

## Requirements

### Functional Requirements
- [ ] Display pins in a grid layout
- [ ] Balance pin distribution across columns
- [ ] Support variable pin heights
- [ ] Responsive column count (1-5 columns based on screen)
- [ ] Infinite scroll pagination
- [ ] Pin interactions (like, save, share)
- [ ] Search functionality
- [ ] Error handling and loading states

### Non-Functional Requirements
- [ ] Performance: Paint/Layout < 16ms (60 FPS)
- [ ] Fast data loading: Initial load < 2s
- [ ] Responsive: Works on mobile to 5K resolution
- [ ] Accessibility: WCAG 2.1 AA compliant
- [ ] SEO: Server-side rendering capability
- [ ] Scalability: Handle 1000+ pins without slowdown

---

## Design Approaches

### Approach 1: Greedy Column Balancing ✅ RECOMMENDED

**Concept**: Distribute items to columns with minimum height

**Algorithm**:
```
1. Initialize M columns with height = 0
2. For each item:
   - Find column with minimum height
   - Add item to that column
   - Update column height += item_height + gap
3. Render all columns side-by-side
```

**Pros**:
- ✅ Simple to implement O(n) time
- ✅ Fast computation
- ✅ Good visual balance
- ✅ Predictable behavior

**Cons**:
- ❌ Not perfectly optimized
- ❌ Can create "orphaned" items at bottom
- ❌ Sensitive to item order

**Use Cases**: Pinterest, Unsplash, Google Photos

---

### Approach 2: CSS Grid Auto-Fit ✅ SIMPLE ALTERNATIVE

**Concept**: Let CSS handle layout automatically

**Code**:
```css
.masonry {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}
```

**Pros**:
- ✅ Zero JavaScript
- ✅ Native browser optimization
- ✅ Automatic responsiveness
- ✅ Accessibility built-in

**Cons**:
- ❌ Height balancing doesn't work as well
- ❌ Items fill by row, not column
- ❌ Less control over layout

**Use Cases**: Basic product grids, portfolio sites

---

### Approach 3: Constraint-Based Optimization ❌ OVERKILL

**Concept**: Use constraint solver to find optimal arrangement

**Tools**: Cassowary, simplex algorithm

**Pros**:
- ✅ Perfect optimization
- ✅ Handles complex constraints

**Cons**:
- ❌ Overkill for Pinterest
- ❌ Complex implementation
- ❌ Slower computation
- ❌ Diminishing returns

**Use Cases**: None for Pinterest (not worth it)

---

### Approach 4: Virtual Scrolling 🔧 FOR SCALE

**Concept**: Only render visible items (viewport)

**Libraries**: react-window, react-virtualized

**Pros**:
- ✅ Handles 10k+ items
- ✅ Constant memory usage
- ✅ Fast scrolling

**Cons**:
- ❌ Complex implementation
- ❌ Tricky with variable heights
- ❌ Extra loading indicator jumps

**Use Cases**: Very large feeds (Google, Twitter)

---

## Deep Dive: Greedy Algorithm

### Visual Walkthrough

```
Input: 6 items, 3 columns
Item heights: [150, 200, 180, 220, 160, 190], gap: 16

Step 1: Start with 3 empty columns
Column 0: []  height: 0
Column 1: []  height: 0
Column 2: []  height: 0

Step 2: Add item 0 (150px) → shortest is Column 0
Column 0: [Item 0]  height: 166 (150 + 16)
Column 1: []        height: 0
Column 2: []        height: 0

Step 3: Add item 1 (200px) → shortest is Column 1
Column 0: [Item 0]  height: 166
Column 1: [Item 1]  height: 216 (200 + 16)
Column 2: []        height: 0

Step 4: Add item 2 (180px) → shortest is Column 2
Column 0: [Item 0]  height: 166
Column 1: [Item 1]  height: 216
Column 2: [Item 2]  height: 196 (180 + 16)

Step 5: Add item 3 (220px) → shortest is Column 0
Column 0: [Item 0, Item 3]  height: 402 (166 + 220 + 16)
Column 1: [Item 1]          height: 216
Column 2: [Item 2]          height: 196

Step 6: Add item 4 (160px) → shortest is Column 2
Column 0: [Item 0, Item 3]  height: 402
Column 1: [Item 1]          height: 216
Column 2: [Item 2, Item 4]  height: 372 (196 + 160 + 16)

Step 7: Add item 5 (190px) → shortest is Column 1
Column 0: [Item 0, Item 3]  height: 402
Column 1: [Item 1, Item 5]  height: 422 (216 + 190 + 16)
Column 2: [Item 2, Item 4]  height: 372

Final Render:
┌─────────────────────────────────────┐
│ Col 0    │ Col 1    │ Col 2         │
├──────────┼──────────┼───────────────┤
│ Item 0   │ Item 1   │ Item 2        │
│ (150px)  │ (200px)  │ (180px)       │
├──────────┼──────────┼───────────────┤
│ Item 3   │ Item 5   │ Item 4        │
│ (220px)  │ (190px)  │ (160px)       │
└──────────┴──────────┴───────────────┘

Column heights: [402, 422, 372]
```

### Pseudo Code

```python
def create_masonry_layout(items, num_columns, gap):
    # Initialize columns
    columns = [{'items': [], 'height': 0} for _ in range(num_columns)]
    
    # Distribute items
    for item in items:
        # Find column with minimum height
        min_column_idx = min(
            range(num_columns),
            key=lambda i: columns[i]['height']
        )
        
        # Add item to column
        columns[min_column_idx]['items'].append(item)
        columns[min_column_idx]['height'] += item.height + gap
    
    return columns
```

### Time & Space Complexity

| Operation | Complexity | Notes |
|-----------|-----------|-------|
| Layout Calculation | O(n × m) | n = items, m = columns |
| Rendering | O(n) | Each item rendered once |
| Rebalancing | O(n × m) | Full recalc on new items |
| **Space** | O(m) | Store column metadata |

### When to Recalculate

```typescript
const layoutedItems = useMemo(() => {
  return createLayout(items, columnCount, gap);
}, [items, columnCount, gap]); // Only when deps change
```

---

## Architecture

### Page Structure

```
HomePage (Data Container)
├── State: pins[], pagination, columnCount
├── Effects: fetchPins() on mount
├── useInfiniteScroll: trigger fetch
│
├── Header
│   ├── Logo
│   ├── Search Bar
│   └── User Menu
│
└── MasonryLayout (Main Content)
    ├── Algorithm: Calculate layout
    ├── Memoization: Re-render only when deps change
    │
    └── For each column:
        └── For each item in column:
            └── PinCard
                ├── Image
                ├── Hover Overlay
                ├── Like Button
                └── Save Button
```

### Data Flow Diagram

```
                        ┌──────────────┐
                        │ Initial Load │
                        └──────┬───────┘
                               ↓
                    ┌──────────────────┐
                    │ Fetch Feed (API) │
                    └──────┬───────────┘
                           ↓
                  ┌────────────────────┐
                  │ Update pins state  │
                  └──────┬─────────────┘
                         ↓
              ┌──────────────────────────┐
              │ Calculate masonry layout │
              │ (memoized)               │
              └──────┬───────────────────┘
                     ↓
          ┌─────────────────────────────┐
          │ Render columns + PinCards   │
          │ (with Framer Motion)        │
          └──────┬──────────────────────┘
                 ↓
      ┌────────────────────────────────┐
      │ Attach Intersection Observer   │
      │ (infinite scroll trigger)      │
      └──────┬───────────────────────┘
             ↓
   ┌─────────────────────────────────┐
   │ User scrolls to bottom           │
   │ Observer fires onLoadMore()      │
   └──────┬──────────────────────────┘
          ↓
    ┌──────────────────┐
    │ Fetch next page  │ ← Loop back to "Fetch Feed"
    └──────────────────┘
```

---

## Code Implementation

### Complete Example

```typescript
// MasonryLayout.tsx - Core component
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Pin {
  id: string;
  imageUrl: string;
  imageHeight: number;
  title: string;
}

interface MasonryLayoutProps {
  items: Pin[];
  columnCount: number;
  gap: number;
}

const MasonryLayout: React.FC<MasonryLayoutProps> = ({
  items,
  columnCount,
  gap,
}) => {
  // Memoize layout calculation
  const columns = useMemo(() => {
    const cols = Array.from({ length: columnCount }, () => ({
      items: [],
      height: 0,
    }));

    items.forEach(item => {
      // Find column with minimum height
      const minIdx = cols.reduce(
        (min, col, idx) => col.height < cols[min].height ? idx : min,
        0
      );

      // Add item to column
      cols[minIdx].items.push(item);
      cols[minIdx].height += item.imageHeight + gap;
    });

    return cols;
  }, [items, columnCount, gap]);

  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
        gap: `${gap}px`,
      }}
    >
      {columns.map((column, colIdx) =>
        column.items.map((item, itemIdx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: (colIdx * 0.1) + (itemIdx * 0.05),
            }}
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              style={{ height: item.imageHeight }}
            />
          </motion.div>
        ))
      )}
    </div>
  );
};

export default MasonryLayout;
```

---

## Optimization Strategies

### 1. Request Deduplication

```typescript
const requestCache = new Map();

async function fetchFeed(cursor) {
  const key = `feed-${cursor}`;
  
  // Return cached Promise if request already in flight
  if (requestCache.has(key)) {
    return requestCache.get(key);
  }
  
  // Create new request
  const request = api.get(`/feed?cursor=${cursor}`)
    .finally(() => requestCache.delete(key));
  
  requestCache.set(key, request);
  return request;
}
```

**Impact**: Prevents duplicate requests when multiple components fetch simultaneously

### 2. Image Lazy Loading

```typescript
const PinCard = ({ pin }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <>
      {!isLoaded && <SkeletonLoader />}
      <img
        src={pin.imageUrl}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
      />
    </>
  );
};
```

**Impact**: Faster page load, smoother scrolling

### 3. Responsive Column Calculation

```typescript
const useResponsiveColumns = () => {
  const [columnCount, setColumnCount] = useState(5);

  useEffect(() => {
    const handleResize = debounce(() => {
      const width = window.innerWidth;
      if (width < 640) setColumnCount(1);
      else if (width < 1024) setColumnCount(2);
      else if (width < 1280) setColumnCount(3);
      else if (width < 1920) setColumnCount(4);
      else setColumnCount(5);
    }, 250);

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial calculation
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return columnCount;
};
```

**Impact**: Automatic layout adaptation without manual intervention

### 4. Intersection Observer for Infinite Scroll

```typescript
const useInfiniteScroll = (onLoadMore) => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        onLoadMore();
      }
    }, {
      rootMargin: '200px', // Trigger 200px before reaching
    });

    if (ref.current) observer.observe(ref.current);
    
    return () => observer.disconnect();
  }, [onLoadMore]);

  return ref;
};
```

**Impact**: Efficient scroll detection without constant event firing

### 5. Virtual Scrolling (for scale)

```typescript
import { FixedSizeList } from 'react-window';

const Row = ({ index, style }) => (
  <div style={style}>
    <PinCard pin={pins[index]} />
  </div>
);

<FixedSizeList
  height={600}
  itemCount={pins.length}
  itemSize={250}
  width="100%"
>
  {Row}
</FixedSizeList>
```

**Use When**: > 500 pins loaded at once

**Impact**: Constant memory, 60 FPS scrolling

---

## Trade-offs Analysis

### Design Decision: Greedy vs. Optimal Algorithm

| Aspect | Greedy | Optimal |
|--------|--------|---------|
| Implementation | Simple | Complex |
| Compute Time | O(n × m) | O(n² × m) |
| Visual Quality | 95% | 100% |
| Practical Benefit | ✓ Good enough | ✗ Overkill |
| **Recommendation** | ✅ Use | ❌ Avoid |

### Design Decision: CSS Grid vs. Custom Layout

| Aspect | CSS Grid | Custom |
|--------|----------|--------|
| Browser Compatibility | Modern browsers | All browsers |
| Height Balancing | Poor | Excellent |
| Control | Limited | Full |
| Performance | Browser optimized | JavaScript |
| **Use Case** | Simple layouts | Pinterest-style |

### Design Decision: Virtual Scroll vs. Pagination

| Aspect | Virtual | Pagination |
|--------|---------|-----------|
| Memory | O(visible) | O(all items) |
| Scroll Feel | Smooth | Clear boundaries |
| Implementation | Complex | Simple |
| SEO | Challenging | Easy |
| **Use When** | Huge lists | Normal feeds |

---

## Common Interview Questions

### Q1: How would you handle items with unknown heights?

**Answer**:
```typescript
// Use image onLoad to get actual height
const [itemHeights, setItemHeights] = useState(new Map());

const handleImageLoad = (id, height) => {
  setItemHeights(prev => new Map(prev).set(id, height));
  // Trigger layout recalculation
};

// In useMemo:
const actualHeight = itemHeights.get(item.id) || ESTIMATED_HEIGHT;
```

### Q2: How would you optimize for different screen sizes?

**Answer**:
```typescript
const useResponsiveColumns = () => {
  const [cols, setCols] = useState(5);

  useEffect(() => {
    const handler = debounce(() => {
      // Recalculate based on viewport
      setCols(calculateColumns(window.innerWidth));
    }, 250);

    window.addEventListener('resize', handler);
    handler(); // Initial

    return () => window.removeEventListener('resize', handler);
  }, []);

  return cols;
};

// Auto-recalculation on every resize
```

### Q3: How would you handle 10,000+ items?

**Answer**:
```typescript
// Use virtual scrolling
import { FixedSizeList } from 'react-window';

// Only render visible window (e.g., 20 items visible)
// Scroll 10,000 items with constant memory
// Append new items as needed

// Alternative: Pagination with cursor
// Load 20 items per page
// No rendering of 10,000 items at once
```

### Q4: How do you prevent layout shift?

**Answer**:
```tsx
// Reserve space with aspect ratio
<div className="aspect-video">
  {!isLoaded && <Skeleton />}
  <img onLoad={() => setLoaded(true)} />
</div>

// Or use known dimensions
<div style={{ height: pin.imageHeight }}>
  <img src={pin.imageUrl} />
</div>
```

### Q5: What's the difference between your approach and Pinterest's?

**Answer**:
```
Our Approach (Simplified):
- Greedy algorithm
- Good performance
- Easy to understand
- Suitable for most use cases

Pinterest's Likely Approach (Estimated):
- Specialized masonry solver
- Weighted column balancing
- Server-side pre-calculation
- Complex optimization for real data
- Handles millions of pins daily

Trade-off: 95% quality with 10% complexity vs. 99% quality with 100% complexity
```

### Q6: How would you add search/filtering?

**Answer**:
```typescript
const handleSearch = (query) => {
  // Reset pagination
  pagination.reset();
  
  // Fetch filtered results
  apiService.fetchFeed(
    20,
    undefined,
    { search: query }
  );
  
  // Layout automatically recalculates
};
```

### Q7: How would you implement boards (save pins)?

**Answer**:
```typescript
const savePin = async (pinId, boardId) => {
  // API call
  await api.post(`/pins/${pinId}/save`, { boardId });
  
  // Update local state
  setPins(prev =>
    prev.map(p =>
      p.id === pinId ? { ...p, savedAt: new Date() } : p
    )
  );
  
  // Optional: Add to separate saved pins array
  setSavedPins(prev => [...prev, pinId]);
};
```

---

## Summary

### Key Takeaways

1. **Greedy Algorithm** is the right choice for Pinterest-style layouts
   - Simple to implement
   - Fast computation
   - Good visual results

2. **Memoization** is critical for performance
   - Prevent unnecessary recalculations
   - useMemo for layout, useCallback for handlers

3. **Infinite Scroll** drives engagement
   - Intersection Observer for efficiency
   - Cursor-based pagination for scalability

4. **Responsive Design** is essential
   - Auto-adjust columns based on screen width
   - Debounced resize handlers

5. **Optimization** comes in layers
   - Image lazy loading
   - Request deduplication
   - Virtual scrolling for scale
   - CSS-in-JS for style efficiency

### Interview Tips

✅ **Do**:
- Explain trade-offs clearly
- Show understanding of complexity analysis
- Mention real-world considerations
- Discuss performance optimizations
- Ask clarifying questions

❌ **Don't**:
- Over-engineer (avoid constraint solvers)
- Ignore responsive design
- Forget error handling
- Overlook accessibility
- Assume unlimited computing resources

---

## Resources

- [CSS Masonry Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Masonry_Layout)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [React Hooks Performance](https://react.dev/reference/react/useMemo)
- [Framer Motion](https://www.framer.com/motion/)
- [Responsive Design Patterns](https://google.com/design/resonsive)

---

**Good luck with your interviews!** 🎯
