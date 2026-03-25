# Pinterest Homepage Design - Technical Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Component Structure](#component-structure)
3. [Masonry Layout Algorithm](#masonry-layout-algorithm)
4. [Data Fetching & State Management](#data-fetching--state-management)
5. [Performance Optimization](#performance-optimization)
6. [Styling Approach](#styling-approach)
7. [Animation Strategy](#animation-strategy)
8. [Setup & Running](#setup--running)

---

## Architecture Overview

### System Design Pattern

```
┌─────────────────────────────────────────────────┐
│            HomePage (Main Container)             │
├─────────────────────────────────────────────────┤
│  Header (Search, Navigation, User Profile)      │
├─────────────────────────────────────────────────┤
│                  MasonryLayout                   │
│  ┌──────────────────────────────────────────┐   │
│  │  Column 1    │  Column 2    │  Column 3   │   │
│  │  ┌─────────┐ │  ┌─────────┐ │ ┌─────────┐│   │
│  │  │ PinCard │ │  │ PinCard │ │ │ PinCard ││   │
│  │  │  (Pin)  │ │  │  (Pin)  │ │ │  (Pin)  ││   │
│  │  └─────────┘ │  └─────────┘ │ └─────────┘│   │
│  │  ┌─────────┐ │  ┌─────────┐ │ ┌─────────┐│   │
│  │  │ PinCard │ │  │ PinCard │ │ │ PinCard ││   │
│  │  │  (Pin)  │ │  │  (Pin)  │ │ │  (Pin)  ││   │
│  │  └─────────┘ │  └─────────┘ │ └─────────┘│   │
│  └──────────────────────────────────────────┘   │
├─────────────────────────────────────────────────┤
│     Infinite Scroll Trigger (Observer Ref)      │
└─────────────────────────────────────────────────┘
```

### Data Flow

```
API Service
    ↓
Pagination Hook (usePagination)
    ↓
HomePage.fetchPins()
    ↓
State: [pins]
    ↓
MasonryLayout.layoutedItems (Computed)
    ↓
Render PinCard components
    ↓
InfiniteScroll Hook (useInfiniteScroll)
    ↓
Trigger fetchPins() when threshold hit
```

---

## Component Structure

### Directory Layout
```
src/
├── components/
│   ├── HomePage.tsx          # Main page container with data fetching
│   ├── Header.tsx            # Top navigation and search
│   ├── MasonryLayout.tsx      # Core masonry grid algorithm
│   └── PinCard.tsx           # Individual pin card with hover effects
├── hooks/
│   └── index.ts              # Custom hooks (useInfiniteScroll, usePagination, etc.)
├── services/
│   └── api.ts                # API communication and data fetching
├── types/
│   └── index.ts              # TypeScript interfaces and types
├── styles/
│   └── globals.css           # Global styles and Tailwind imports
├── App.tsx                   # Root component
├── main.tsx                  # React entry point
└── index.html                # HTML template
```

### Key Components

#### 1. **HomePage**
- **Responsibility**: Orchestrate data fetching, pagination, and error handling
- **Props**: None
- **State**: 
  - `pins`: Array of Pin objects
  - `error`: Error message for display
  - `isLoading`: Loading state
- **Hooks Used**:
  - `useResponsiveColumns()`: Adaptive column count
  - `usePagination()`: Cursor-based pagination
  - `useInfiniteScroll()`: Automatic load on scroll

#### 2. **MasonryLayout**
- **Responsibility**: Core layout algorithm that distributes pins across columns
- **Props**:
  ```typescript
  {
    items: Pin[]
    columnCount: number
    gap: number
    isLoading?: boolean
    onLoadMore?: () => void
  }
  ```
- **Algorithm**: Greedy column balancing (places each item in the shortest column)

#### 3. **PinCard**
- **Responsibility**: Individual pin display with hover interactions
- **Features**:
  - Image lazy loading with skeleton
  - Like/Save functionality
  - User profile display
  - Hover overlay with actions
- **Animations**: Framer Motion for smooth transitions

#### 4. **Header**
- **Responsibility**: Navigation and search functionality
- **Features**:
  - Search bar with focus animations
  - Navigation menu
  - Notification bell
  - User profile dropdown

---

## Masonry Layout Algorithm

### Core Algorithm: Column Height Balancing

```typescript
// Simplified algorithm
const layout = (items, columnCount) => {
  const columns = new Array(columnCount).fill({ items: [], height: 0 });
  
  items.forEach(item => {
    // Find column with minimum height
    const shortestColumnIndex = columns.reduce(
      (minIdx, col, idx) => 
        col.height < columns[minIdx].height ? idx : minIdx,
      0
    );
    
    // Add item to shortest column
    columns[shortestColumnIndex].items.push(item);
    columns[shortestColumnIndex].height += item.estimatedHeight + gap;
  });
  
  return columns;
};
```

### Time Complexity Analysis
- **Display Calculation**: O(n × m) where n = items, m = columns
- **Rendering**: O(n) items rendered
- **Rebalancing**: Only when items array changes (memoized)

### Visual Example

```
Column 1      Column 2      Column 3
┌────────┐   ┌────────┐   ┌────────┐
│ Pin A  │   │ Pin B  │   │ Pin C  │
│ (250px)│   │(300px) │   │ (250px)│
└────────┘   └────────┘   └────────┘
             ┌────────┐
             │ Pin D  │
Height: 250  │(280px) │   Height: 250
             └────────┘
             Height: 580

After rebalancing:
┌────────┐   ┌────────┐   ┌────────┐
│ Pin A  │   │ Pin B  │   │ Pin C  │
└────────┘   └────────┘   └────────┘
┌────────┐   ┌────────┐   ┌────────┐
│ Pin D  │   │ Pin E  │   │ Pin F  │
└────────┘   └────────┘   └────────┘
```

### Responsive Breakpoints

| Screen Size | Columns | Max Width |
|-------------|---------|-----------|
| < 640px    | 1       | -         |
| 640-1024px | 2       | -         |
| 1024-1280px| 3       | -         |
| 1280-1920px| 4       | -         |
| ≥ 1920px   | 5       | -         |

---

## Data Fetching & State Management

### Pagination Strategy: Cursor-Based

```
Request 1: fetchFeed(pageSize=20, cursor=undefined)
Response: { pins: [...20 pins], nextCursor: "cursor-1", hasMore: true }
         ↓
Request 2: fetchFeed(pageSize=20, cursor="cursor-1")
Response: { pins: [...20 pins], nextCursor: "cursor-2", hasMore: true }
         ↓
Request N: hasMore=false → Stop pagination
```

### API Service Features

1. **Request Deduplication**
   ```typescript
   const requestCache = new Map();
   
   // Same request returns same Promise
   const p1 = fetchFeed(20, "cursor-1");
   const p2 = fetchFeed(20, "cursor-1");
   // p1 === p2 (same Promise)
   ```

2. **Response Caching**
   ```typescript
   const responseCache = new Map();
   // Store successful responses
   cache.set(cacheKey, response.data.pins);
   ```

3. **Error Handling**
   - Interceptors for auth tokens
   - Error logging and user feedback
   - Graceful fallback to mock data

### usePagination Hook

```typescript
interface PaginationState {
  cursor?: string;      // For next page
  isLoading: boolean;  // Fetch in progress
  hasMore: boolean;    // More data available
  page: number;        // Current page number
}
```

**Methods**:
- `fetchMore(cursor, hasMore)`: Update pagination state
- `setLoading(isLoading)`: Toggle loading state
- `reset()`: Clear pagination (for search)

---

## Performance Optimization

### 1. **Memoization**
```typescript
// MasonryLayout.tsx
const layoutedItems = useMemo(() => {
  // Only recalculate when dependencies change
  return calculateLayout(items, columnCount, gap);
}, [items, columnCount, gap]);
```

### 2. **Intersection Observer**
```typescript
// Detect when user scrolls to trigger
const observerTarget = useInfiniteScroll(() => {
  // Only fetch when threshold crossed
});
```

### 3. **Request Deduplication**
- Multiple simultaneous requests for same data return same Promise
- Prevents duplicate API calls

### 4. **Image Optimization**
```typescript
// Skeleton loading while image loads
{!isImageLoaded && <LoadingSkeleton />}

<img onLoad={() => setIsImageLoaded(true)} />
```

### 5. **Responsive Resizing**
- Debounced resize handler (250ms delay)
- Prevents jank from rapid column recalculations

---

## Styling Approach

### Tailwind CSS Utilities

**Color Palette** (Custom Pinterest theme):
```javascript
{
  pinterest: {
    red: '#E60023',      // Primary CTA color
    light: '#f5f5f5',    // Off-white background
    gray: '#767676',     // Text gray
    dark: '#111111'      // Dark text
  }
}
```

**Key Classes Used**:
- `grid` + `grid-cols-*`: Responsive column layout
- `gap-4`: Spacing between pins
- `rounded-2xl`: Rounded corners (Pinterest style)
- `shadow-sm`, `shadow-lg`: Depth
- `hover:shadow-lg`: Subtle hover effect
- `py-6`, `px-4`: Responsive padding

### CSS Variables & Media Queries
```css
/* Dark mode support */
@media (prefers-color-scheme: dark) {
  /* Dark theme colors */
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; }
}
```

---

## Animation Strategy

### Framer Motion Usage

#### 1. **Page Entry Animation**
```typescript
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  {children}
</motion.div>
```

#### 2. **Item Entry Stagger**
```typescript
<motion.div
  variants={getItemVariants(columnIndex, itemIndex)}
  initial="hidden"
  animate="visible"
  // Delay = columnIndex * 0.1 + itemIndex * 0.05
/>
```

#### 3. **Hover Effects**
```typescript
<motion.div
  whileHover={{ y: -4, boxShadow: '...' }}
  whileTap={{ scale: 0.95 }}
>
  {content}
</motion.div>
```

#### 4. **Loading Spinner**
```typescript
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 1, repeat: Infinity }}
>
  <Spinner />
</motion.div>
```

### Performance Considerations
- Use `transform` and `opacity` only (GPU-optimized)
- Avoid animating `width`, `height`, `top`, `left`
- Use `layout={false}` to prevent layout thrashing

---

## Setup & Running

### Prerequisites
```bash
# Node.js 18+
node --version

# npm or yarn
npm --version
```

### Installation

```bash
# Navigate to project
cd pinterest_grid

# Install dependencies
npm install

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer

# Generate Tailwind config (already done)
npx tailwindcss init -p
```

### Development Server

```bash
# Start dev server on http://localhost:3000
npm run dev
```

Features:
- Hot Module Replacement (HMR)
- Fast refresh
- Auto-open in browser

### Production Build

```bash
# Build for production
npm run build

# Output in dist/ directory
# Preview build locally
npm run preview
```

### Project Structure Setup

```
pinterest_grid/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json (add as needed)
├── index.html
├── src/
│   ├── types/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── styles/
│   ├── App.tsx
│   └── main.tsx
└── dist/ (after build)
```

---

## Key Learnings & Best Practices

### 1. **Masonry Layout Considerations**
- ✅ Use greedy algorithm for simple, performant layouts
- ❌ Avoid complex constraint-solving (overkill for Pinterest)
- ✅ Calculate heights based on aspect ratios
- ❌ Don't animate layout rebalancing heavily

### 2. **Infinite Scroll Best Practices**
- ✅ Use Intersection Observer API (performant, native)
- ❌ Avoid scroll event listeners (poor performance)
- ✅ Disable observer during fetch (prevent duplicate requests)
- ❌ Don't fetch all data upfront (pagination is essential)

### 3. **React Patterns**
- ✅ Memoize expensive calculations with useMemo
- ✅ Use custom hooks for reusable logic
- ❌ Avoid inline function creation in maps
- ✅ Separate concerns (data fetching, layout, styling)

### 4. **Performance Tips**
- ✅ Lazy load images with skeleton loaders
- ✅ Debounce resize handlers
- ✅ Cache API responses
- ❌ Don't render all items at once for long lists
- ✅ Use virtualization for extremely long lists (future optimization)

---

## Future Enhancements

### Phase 1: Core Features
- [ ] Real API integration (replace mock data)
- [ ] User authentication
- [ ] Board management
- [ ] Pin creation/editing

### Phase 2: Performance
- [ ] Virtual list for very long feeds (react-window)
- [ ] Image optimization (WebP, srcset)
- [ ] Service Worker for offline support
- [ ] Progressive Image Loading (blur hash)

### Phase 3: Advanced Features
- [ ] Dark mode
- [ ] Filters and search
- [ ] Comments and reactions
- [ ] Real-time notifications
- [ ] Drag-and-drop reordering

### Phase 4: Accessibility
- [ ] ARIA labels and roles
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] Focus management

---

## Troubleshooting

### Layout Issues
**Problem**: Columns not balanced
- **Solution**: Ensure images have correct `imageHeight` values
- Verify `estimatedItemHeight` constant matches actual heights

**Problem**: Jumping/reflow on load
- **Solution**: Reserve space with aspect ratio container
- Use `aspect-square` or calculated aspect ratio

### Performance Issues
**Problem**: Slow scroll/jank
- **Solution**: Check if animations are heavy
- Verify Intersection Observer is working
- Use Performance tab in DevTools

**Problem**: Memory leak
- **Solution**: Ensure cleanup in useEffect return
- Clear request cache periodically

---

## References

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [React Infinite Scroll Pattern](https://infinite-scroll.com/)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [Pinterest Engineering Blog](https://www.pinterest.com/search/?q=engineering)
