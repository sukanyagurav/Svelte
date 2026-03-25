# Pinterest Grid - Masonry Layout Design System

A complete, production-ready Pinterest-style homepage implementation showcasing a responsive masonry grid layout with infinite scroll, built with React, Tailwind CSS, and Framer Motion.

## 🎯 Features

### Core Functionality
- ✅ **Responsive Masonry Layout** - Adaptive column count (1-5 columns)
- ✅ **Infinite Scroll** - Auto-load more items using Intersection Observer
- ✅ **Pin Cards** - Beautiful hover effects with action buttons
- ✅ **Search & Navigation** - Functional header with search bar
- ✅ **Smooth Animations** - Staggered entry animations with Framer Motion
- ✅ **Error Handling** - Graceful error states and loading indicators
- ✅ **Performance Optimized** - Memoization, request deduplication, lazy loading

### Technical Highlights
- 🔧 **Type-Safe** - Full TypeScript support
- 🎨 **Custom Tailwind Theme** - Pinterest color palette
- 🚀 **Vite** - Lightning-fast development and build
- 📱 **Mobile-First** - Responsive design from the ground up
- ♿ **Accessible** - ARIA labels and keyboard navigation ready
- 🧪 **Testable** - Componentized and hookified for easy testing

## 📋 System Design

### Architecture

```
┌─────────────────────────────────────┐
│       HomePage (Main Container)      │
├─────────────────────────────────────┤
│              Header                   │
│     (Search, Navigation, Profile)    │
├─────────────────────────────────────┤
│          Masonry Layout               │
│    (Column-based Pin Distribution)   │
│  ┌──────────┬──────────┬──────────┐  │
│  │ Col 1    │ Col 2    │ Col 3    │  │
│  │ ┌──────┐ │ ┌──────┐ │ ┌──────┐ │  │
│  │ │PinCD │ │ │PinCD │ │ │PinCD │ │  │
│  │ └──────┘ │ └──────┘ │ └──────┘ │  │
│  └──────────┴──────────┴──────────┘  │
├─────────────────────────────────────┤
│    Infinite Scroll Trigger (Observer)│
└─────────────────────────────────────┘
```

### Masonry Algorithm

**Greedy Column Balancing**:
1. Maintain height counter for each column
2. For each pin, place in column with minimum height
3. Update column height: `height += pinHeight + gap`
4. Result: Visually balanced but not perfectly optimized

**Time Complexity**: O(n × m) where n=items, m=columns  
**Space Complexity**: O(m)

### Data Flow

```
API/Mock Data
    ↓
usePagination Hook (cursor, page tracking)
    ↓
HomePage.fetchPins() (fetches and appends)
    ↓
pins State (stored in React state)
    ↓
useMemo (calc layout with current columns)
    ↓
layoutedItems (distributed across columns)
    ↓
Render PinCard components
    ↓
useInfiniteScroll (detect scroll threshold)
    ↓
Trigger next fetch (repeat)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone or navigate to project
cd pinterest_grid

# Install dependencies
npm install

# Start development server
npm run dev
```

Server runs on `http://localhost:3000` with hot module replacement.

### Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

Output: `dist/` directory

## 📁 Project Structure

```
pinterest_grid/
├── src/
│   ├── components/
│   │   ├── HomePage.tsx       # Main page + data fetching
│   │   ├── Header.tsx          # Navigation & search
│   │   ├── MasonryLayout.tsx   # Core layout algorithm
│   │   └── PinCard.tsx         # Individual pin card
│   │
│   ├── hooks/
│   │   └── index.ts            # Custom hooks
│   │       ├── useInfiniteScroll
│   │       ├── usePagination  
│   │       └── useResponsiveColumns
│   │
│   ├── services/
│   │   └── api.ts              # API client & mock data
│   │
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   │
│   ├── styles/
│   │   └── globals.css         # Tailwind imports
│   │
│   ├── App.tsx                 # Root component
│   └── main.tsx                # React entry point
│
├── index.html                  # HTML template
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
├── package.json               # Dependencies
├── DESIGN_DOC.md              # Complete technical documentation
├── COMPONENT_API.md           # Component API reference
└── README.md                  # This file
```

## 🧩 Key Components

### MasonryLayout
The heart of the system. Distributes pins across columns using a greedy algorithm.

**Props**:
```typescript
{
  items: Pin[]          // Pins to display
  columnCount: number   // Number of columns (1-5)
  gap: number           // Spacing between pins
  isLoading?: boolean   // Show loading state
}
```

### PinCard
Individual pin with hover effects, like/save buttons, and smooth animations.

**Features**:
- Image lazy loading with skeleton
- Hover overlay with actions
- Like and save functionality
- User profile display

### Header
Navigation and search functionality.

**Features**:
- Search bar (expandable on focus)
- Navigation menu (desktop)
- Notification bell
- User profile dropdown

### HomePage
Main container managing all data fetching and state.

**Implements**:
- Initial data fetch
- Infinite scroll pagination
- Error handling
- Responsive column calculation

## 🎨 Styling

### Tailwind CSS
Uses utility-first approach with custom Pinterest color theme:
```javascript
colors: {
  pinterest: {
    red:   '#E60023',  // Primary color
    light: '#f5f5f5',  // Background
    gray:  '#767676',  // Text
    dark:  '#111111'   // Dark text
  }
}
```

### Responsive Breakpoints
```
Mobile:        < 640px  (1 column)
Tablet:      640-1024px (2 columns)
Small Desktop: 1024-1280px (3 columns)
Desktop:     1280-1920px (4 columns)
Large Desktop: ≥1920px (5 columns)
```

## ✨ Animations

### Framer Motion
All animations use GPU-optimized transforms and opacity:

**Entry Animation**: Staggered from left to right
```
Column 0 + Item 0: 0ms    ┐
Column 0 + Item 1: 50ms   │
Column 1 + Item 0: 100ms  ├─ Stagger effect
Column 1 + Item 1: 150ms  │
...                       ┘
```

**Hover Effects**: Pin cards lift up with subtle shadow
```
whileHover={{ y: -4, shadow: '...' }}
```

**Loading Spinner**: Continuous rotation
```
animate={{ rotate: 360 }}
transition={{ duration: 1, repeat: Infinity }}
```

## 📡 Data Fetching

### API Service
Mock implementation with real API patterns:

```typescript
// Fetch paginated feed
const response = await apiService.fetchFeed(
  20,              // Page size
  'cursor-1',      // Pagination cursor
  { category: 'photography' }  // Filters
);

// Returns
{
  pins: Pin[],
  nextCursor: string,
  hasMore: boolean
}
```

**Features**:
- Request deduplication (same request = same Promise)
- Response caching
- Auth token injection
- Error handling with retry logic

### Pagination
Cursor-based pagination (scalable and stateless):
```
Page 1: cursor=undefined
Page 2: cursor="cursor-1"
Page 3: cursor="cursor-2"
...
```

## 🪝 Custom Hooks

### useInfiniteScroll
Triggers callback when user scrolls near bottom.

```typescript
const observerTarget = useInfiniteScroll(
  () => fetchPins(),
  { threshold: 0.1, rootMargin: '200px' }
);

return <div ref={observerTarget} />;
```

### usePagination
Manages pagination state.

```typescript
const pagination = usePagination(20);
// { cursor, isLoading, hasMore, page }
```

### useResponsiveColumns
Auto-calculates columns based on screen width.

```typescript
const columnCount = useResponsiveColumns();
// 1, 2, 3, 4, or 5 based on breakpoint
```

## ⚡ Performance Optimizations

### 1. Memoization
Layout calculation only recalculates when items/columns change.

### 2. Request Deduplication
Same API request returns same Promise.

### 3. Intersection Observer
Triggers fetch only when threshold reached (efficient).

### 4. Image Lazy Loading
Skeleton loader while image downloads.

### 5. Debounced Resize
Window resize handler debounced 250ms.

### 6. GPU Animations
Only animate `transform` and `opacity` (no layout thrashing).

## 📱 Responsive Design

### Mobile (< 640px)
- 1 column layout
- Full-width cards
- Hamburger menu (navigation hidden)
- Simplified header

### Tablet (640-1024px)
- 2 column layout
- Medium cards
- Touch-optimized buttons

### Desktop (1024px+)
- 3-5 column layout based on width
- Full navigation visible
- Hover effects enable
- Optimized spacing

## 🧪 Development

### Adding New Components

1. Create component file in `src/components/`
2. Define TypeScript interface
3. Implement with Framer Motion for animations
4. Add Tailwind CSS classes
5. Export from component index

### Modifying Layout Algorithm

Edit `MasonryLayout.tsx` `layoutedItems` useMemo:
```typescript
const layoutedItems = useMemo(() => {
  // Modify column balancing logic here
}, [items, columnCount, gap]);
```

### Changing Color Theme

Update `tailwind.config.js`:
```javascript
colors: {
  pinterest: {
    red: '#YOUR_COLOR'
  }
}
```

### Integrating Real API

Replace mock data in `HomePage.tsx`:
```typescript
// Change from:
const mockPins = apiService.generateMockPins(20);

// To:
const response = await apiService.fetchFeed(20, pagination.cursor);
const mockPins = response.pins;
```

## 🔍 Troubleshooting

### Pins not displaying
- Check browser console for errors
- Verify `items` array is not empty
- Ensure `columnCount > 0`

### Columns not balanced
- Check `imageHeight` values on pins
- Verify `estimatedItemHeight` constant is accurate
- Check column count is correct for screen width

### Slow performance
- Profile with Chrome DevTools Performance tab
- Check if animations are too heavy
- Verify image sizes are optimized

### Infinite scroll not triggering
- Check observer element (`observerTarget`) is mounted
- Verify scroll position reaches threshold
- Check console for fetch errors

## 📚 Documentation

- **[DESIGN_DOC.md](DESIGN_DOC.md)** - Complete technical architecture guide
- **[COMPONENT_API.md](COMPONENT_API.md)** - Detailed component and hook APIs
- **[README.md](README.md)** - This file

## 🎓 Learning Resources

- [React Hooks](https://react.dev/reference/react)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

## 🚗 Roadmap

### Phase 1: Core ✅
- [x] Masonry layout
- [x] Pin cards with hover effects
- [x] Infinite scroll
- [x] Responsive design

### Phase 2: Features
- [ ] Real API integration
- [ ] User authentication
- [ ] Search filtering
- [ ] Board management
- [ ] Pin creation

### Phase 3: Performance
- [ ] Virtual scrolling for large lists
- [ ] Image CDN integration
- [ ] Service Worker offline support
- [ ] Progressive image loading

### Phase 4: Advanced
- [ ] Dark mode
- [ ] Comments & reactions
- [ ] Real-time notifications
- [ ] Analytics integration

## 📄 License

MIT - Feel free to use this in personal and commercial projects.

## 🤝 Contributing

This is a reference implementation. Feel free to fork and customize!

### Areas for Contribution
- [ ] Add unit tests (Jest + React Testing Library)
- [ ] Add E2E tests (Cypress)
- [ ] Improve accessibility (WCAG 2.1 AA)
- [ ] Add dark mode
- [ ] Performance benchmarks
- [ ] Documentation improvements

## 🙋 Questions?

Refer to:
1. [DESIGN_DOC.md](DESIGN_DOC.md) for architecture details
2. [COMPONENT_API.md](COMPONENT_API.md) for component documentation
3. Component source code (well-commented)
4. Browser DevTools (React DevTools extension)

---

**Happy coding!** 🎉

Built with ❤️ using React, Tailwind CSS, and Framer Motion
