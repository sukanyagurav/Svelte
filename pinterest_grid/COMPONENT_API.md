# Component API Reference

## MasonryLayout Component

The core layout component that distributes pins across multiple columns using a greedy algorithm.

### Props

```typescript
interface MasonryLayoutProps {
  items: Pin[]           // Array of pins to display
  columnCount: number    // Number of columns (1-5)
  gap: number            // Gap between items in pixels
  isLoading?: boolean    // Show loading state
  onLoadMore?: () => void // Callback for infinite scroll
}
```

### Usage Example

```tsx
import MasonryLayout from './components/MasonryLayout';

<MasonryLayout
  items={pins}
  columnCount={5}
  gap={16}
  isLoading={isLoading}
  onLoadMore={handleLoadMore}
/>
```

### How It Works

1. **Input**: Array of `Pin` objects
2. **Process**: 
   - Creates N columns initialized with height 0
   - For each pin, places it in the column with minimum height
   - Calculates column height based on estimated pin height + gap
3. **Output**: Memoized column layout, only recalculates when dependencies change

### Performance Characteristics

- **Time Complexity**: O(n × m) where n = items, m = columns
- **Space Complexity**: O(m)
- **Memoization**: Prevents unnecessary recalculations
- **GPU Accelerated**: Uses Framer Motion for smooth animations

---

## PinCard Component

Displays individual pins with hover effects and interactions.

### Props

```typescript
interface PinCardProps {
  pin: Pin                    // Pin object to display
  columnIndex: number         // Index of column (for stagger animation)
  index: number              // Index within column
  onHover?: (id: string) => void // Hover callback
  hoveredId?: string         // ID of currently hovered pin
}
```

### Features

#### Image Loading
- Skeleton loader while image loads
- Smooth fade-in animation
- Aspect ratio preservation

#### Hover Overlay
- Appears on mouse enter
- Contains action buttons (save, share)
- User info display
- Like button

#### Interactions
- **Like**: Toggle like state (changes color to red)
- **Save**: Opens board selection dropdown
- **Share**: Share to external platforms

### Usage Example

```tsx
import PinCard from './components/PinCard';

<PinCard
  pin={pin}
  columnIndex={0}
  index={0}
  onHover={handleHover}
  hoveredId={hoveredId}
/>
```

### Button Actions

| Button | Action | State Change |
|--------|--------|--------------|
| Like ❤️ | Like pin | `isLiked: false → true` |
| Save 🔖 | Save to board | `isSaved: false → true`, opens menu |
| Share ↗️ | Share pin | Opens share menu (future) |

---

## Header Component

Navigation header with search and profile menu.

### Props

```typescript
interface HeaderProps {
  onSearch?: (query: string) => void // Search callback
}
```

### Features

#### Search Bar
- Autocomplete support (extensible)
- Focus animation expands width
- Clear button (X) when text entered
- Enter key submits search

#### Navigation Menu (Desktop Only)
- Home: 🏠 Return to feed
- Explore: 🔥 Browse categories
- Create: ➕ Create new pin
- Messages: 💬 View messages

#### User Section
- Notification bell with dot indicator
- Profile avatar dropdown
- Mobile hamburger menu

### Usage Example

```tsx
import Header from './components/Header';

<Header onSearch={(query) => {
  console.log('Searching for:', query);
  // Trigger search filter
}} />
```

### Responsive Behavior

| Screen Size | Navigation Visible | Mobile Menu |
|-------------|-------------------|------------|
| < 1024px   | Hidden            | Yes        |
| ≥ 1024px   | Visible           | No         |

---

## HomePage Component

Main application container managing data fetching and state.

### State Management

```typescript
{
  pins: Pin[]              // Currently loaded pins
  error: string | null     // Error message
  pagination: {
    cursor: string         // Next page cursor
    isLoading: boolean     // Fetch in progress
    hasMore: boolean       // More data available
    page: number           // Current page (0-indexed)
  }
  columnCount: number      // Responsive column count
}
```

### Data Flow

```
1. Component mounts
   ↓
2. Initial fetch triggered
   ↓
3. Pins rendered in MasonryLayout
   ↓
4. Observer detects scroll to bottom
   ↓
5. Fetch next page
   ↓
6. Append new pins to state
   ↓
7. Repeat 4-6
```

### Error Handling

```tsx
// Errors displayed as dismissible banner
{error && (
  <motion.div className="bg-red-50">
    <p>{error}</p>
    <button onClick={dismissError}>✕</button>
  </motion.div>
)}
```

### Loading States

| State | Display |
|-------|---------|
| Initial load | Spinner in center |
| Pagination | Spinner at bottom |
| No more data | "You've reached the end" message |
| Empty | Empty state with icon |

---

## Custom Hooks

### useInfiniteScroll

Triggers callback when user scrolls to threshold.

```typescript
const observerTarget = useInfiniteScroll(
  () => {
    // Load more items
    fetchPins();
  },
  {
    threshold: 0.1,        // 10% visible
    rootMargin: '200px'    // 200px before reaching
  }
);

// Attach to element
<div ref={observerTarget} />
```

**Options**:
- `threshold`: 0-1, how much element must be visible
- `rootMargin`: CSS margin value for additional trigger distance

**Features**:
- Intersection Observer API (performant)
- Prevents duplicate requests during async operations
- Automatic cleanup

### usePagination

Manages pagination state.

```typescript
const pagination = usePagination(20); // 20 items per page

// Methods
pagination.fetchMore(nextCursor, hasMore);
pagination.setLoading(true);
pagination.reset(); // Clear for search

// Properties
{
  cursor: 'cursor-1',
  isLoading: false,
  hasMore: true,
  page: 0
}
```

### useResponsiveColumns

Calculates columns based on screen width.

```typescript
const columns = useResponsiveColumns(5); // Default 5 columns

// Auto-updates on resize (debounced 250ms)
// Returns: 1, 2, 3, 4, or 5 based on screen size
```

**Breakpoints**:
```
< 640px    → 1 column
640-1024px → 2 columns
1024-1280px → 3 columns
1280-1920px → 4 columns
≥ 1920px   → 5 columns
```

---

## Type Definitions

### Pin Interface

```typescript
interface Pin {
  id: string;              // Unique identifier
  title: string;           // Pin title
  description?: string;    // Optional description
  imageUrl: string;        // Image source URL
  imageHeight: number;     // Image height (for aspect ratio)
  imageWidth: number;      // Image width
  createdAt: string;       // ISO date string
  likes: number;           // Number of likes
  boardName?: string;      // Associated board name
  boardId?: string;        // Associated board ID
  avatarUrl?: string;      // Creator's avatar
  userName?: string;       // Creator's name
  userId?: string;         // Creator's ID
}
```

### FeedResponse Interface

```typescript
interface FeedResponse {
  pins: Pin[];             // Array of pins
  nextCursor?: string;     // Cursor for next page
  hasMore: boolean;        // More data available
}
```

---

## Styling Classes

### Tailwind Utilities

**Masonry Grid**:
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" />
```

**Pin Card**:
```tsx
<div className="rounded-2xl overflow-hidden shadow-sm hover:shadow-lg" />
```

**Button Styling**:
```tsx
<button className="bg-white hover:bg-gray-50 rounded-full px-4 py-2" />
<button className="bg-pinterest-red text-white font-semibold" />
```

**Text**:
```tsx
<p className="text-white/70 text-xs" />        // Reduced opacity
<h3 className="text-white font-semibold" />    // Bold heading
<p className="line-clamp-2" />                 // Truncate to 2 lines
```

### Custom Classes

```css
.glass               /* Glassmorphism effect */
.shadow-hover       /* Hover shadow transition */
.line-clamp-2       /* Truncate text (2 lines) */
.line-clamp-3       /* Truncate text (3 lines) */
```

---

## API Service

### Methods

#### fetchFeed(pageSize, cursor, filters)

```typescript
const response = await apiService.fetchFeed(
  20,                          // pageSize
  'cursor-1',                  // cursor (optional)
  { category: 'photography' }  // filters (optional)
);

// Returns: FeedResponse { pins: [...], nextCursor: '...', hasMore: true }
```

**Features**:
- Request deduplication (same request returns same Promise)
- Response caching
- Automatic auth token injection
- Error handling

#### fetchPin(pinId)

```typescript
const pin = await apiService.fetchPin('pin-123');
// Returns: Pin
```

#### likePin(pinId)

```typescript
const result = await apiService.likePin('pin-123');
// Returns: { success: true, likes: 1234 }
```

#### savePin(pinId, boardId)

```typescript
const result = await apiService.savePin('pin-123', 'board-456');
// Returns: { success: true }
```

#### generateMockPins(count)

Static method for development/testing.

```typescript
const mockPins = apiService.generateMockPins(20);
// Returns: Pin[]
```

#### clearCache()

Clear all caches (request + response).

```typescript
apiService.clearCache();
```

---

## Animation Variants

### Pin Entry Animation

```typescript
variants={{
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: (columnIndex * 0.1) + (itemIndex * 0.05),
      duration: 0.4,
      ease: 'easeOut',
    },
  }
}}
```

**Stagger Effect**: 
- Each column introduces items with 0.1s delay
- Within column, each item introduces with additional 0.05s delay
- Creates cascading effect from left to right

### Exit Animation

```typescript
exit={{
  opacity: 0,
  y: -20,
  transition: { duration: 0.3 }
}}
```

### Hover Effects

```typescript
whileHover={{ y: -4, boxShadow: '0 10px 32px rgba(0,0,0,0.1)' }}
whileTap={{ scale: 0.95 }}
```

---

## Responsive Design Strategy

### Mobile-First Approach

```tsx
// Start with mobile
<div className="w-full h-auto">
  
  {/* Tablet and up */}
  <div className="hidden sm:block">
    
    {/* Desktop and up */}
    <div className="hidden lg:block" />
  </div>
</div>
```

### Breakpoints Used

| Prefix | Width  | Device |
|--------|--------|--------|
| (none) | 0      | Mobile |
| sm     | 640px  | Tablet |
| lg     | 1024px | Desktop |
| xl     | 1280px | Large |

---

## Performance Tips

### Memoization
```tsx
const items = useMemo(() => {
  return calculateLayout(pins, columns);
}, [pins, columns]); // Only recalc when deps change
```

### Lazy Loading
```tsx
{!isImageLoaded && <Skeleton />}
<img onLoad={() => setIsImageLoaded(true)} />
```

### Event Debouncing
```tsx
const handleResize = debounce(() => {
  calculateColumns();
}, 250);

window.addEventListener('resize', handleResize);
```

### Preventing Re-renders
```tsx
// Use callback to maintain referential equality
const handleLike = useCallback((e) => {
  setIsLiked(!isLiked);
}, [isLiked]);
```

---

## Debugging

### Console Logs

Enable debug logging in HomePage:

```typescript
// Add to fetchPins()
console.log('Fetching page:', pagination.page);
console.log('Loaded pins:', pins.length);
```

### DevTools Tips

1. **React DevTools**
   - Inspect component tree
   - View state and props
   - Trigger re-renders

2. **Performance Profiler**
   - Record render times
   - Identify unnecessary renders
   - Check animation performance

3. **Network Tab**
   - Monitor API requests
   - Check request deduplication
   - Verify cache hits

### Common Issues

**Pins not appearing**:
- Check if `items` array is empty
- Verify `columnCount` > 0
- Check browser console for errors

**Layout jumping**:
- Ensure all images have `imageHeight` set
- Use aspect ratio containers
- Check `gap` value

**Performance issues**:
- Check animations aren't too heavy
- Verify Intersection Observer working
- Profile with DevTools
