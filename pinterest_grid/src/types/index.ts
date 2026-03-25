// Types and interfaces for Pinterest Grid application

export interface Pin {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  imageHeight: number; // For calculating masonry height
  imageWidth: number;
  createdAt: string;
  likes: number;
  boardName?: string;
  boardId?: string;
  avatarUrl?: string;
  userName?: string;
  userId?: string;
}

export interface FeedResponse {
  pins: Pin[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface MasonryLayoutProps {
  items: Pin[];
  columnCount: number;
  gap: number;
  isLoading?: boolean;
  onLoadMore?: () => void;
}

export interface PinCardProps {
  pin: Pin;
  columnIndex: number;
  index: number;
  onHover?: (id: string) => void;
  hoveredId?: string;
}

export interface InfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
}

export interface PaginationState {
  cursor?: string;
  isLoading: boolean;
  hasMore: boolean;
  page: number;
}
