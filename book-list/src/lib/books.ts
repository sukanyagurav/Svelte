import type { Book } from './types';

export const books: Book[] = [
  {
    id: 1,
    title: 'Thinking with Type',
    author: 'Ellen Lupton',
    cover: 'https://via.placeholder.com/300x400/FF9500/ffffff?text=Thinking+with+Type',
    status: 'reading'
  },
  {
    id: 2,
    title: 'Know Your Onions - Web design',
    author: 'Drew de Soto',
    cover: 'https://via.placeholder.com/300x400/0066FF/ffffff?text=Know+Your+Onions',
    status: 'reading'
  },
  {
    id: 3,
    title: 'Universal Principles of Design',
    author: 'Lidwell, Holden & Butler',
    cover: 'https://via.placeholder.com/300x400/4169E1/ffffff?text=Universal+Principles',
    status: 'wishlist'
  },
  {
    id: 4,
    title: "Don't Make Me Think",
    author: 'Steve Krug',
    cover: 'https://via.placeholder.com/300x400/C41E3A/ffffff?text=Dont+Make+Me+Think',
    status: 'purchased'
  },
  {
    id: 5,
    title: 'White Space',
    author: 'Kim Golombisky',
    cover: 'https://via.placeholder.com/300x400/FF6B6B/ffffff?text=White+Space',
    status: 'wishlist'
  },
  {
    id: 6,
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    cover: 'https://via.placeholder.com/300x400/2D6A4F/ffffff?text=Design+of+Everyday',
    status: 'purchased'
  }
];
