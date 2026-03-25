export interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  status: 'reading' | 'wishlist' | 'purchased';
}
