import axios, { AxiosInstance } from 'axios';
import { Pin, FeedResponse } from '../types';

/**
 * API Service for Pinterest-like data fetching
 * Handles data fetching, caching, and pagination
 */
class PinterestApiService {
  private api: AxiosInstance;
  private cache: Map<string, Pin[]> = new Map();
  private requestCache: Map<string, Promise<FeedResponse>> = new Map();

  constructor(baseURL: string = 'https://api.example.com') {
    this.api = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Add request interceptor for authentication if needed
    this.api.interceptors.request.use(config => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      response => response,
      error => {
        console.error('API Error:', error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Fetch feed pins with pagination
   * @param pageSize - Number of pins to fetch
   * @param cursor - Pagination cursor for next page
   * @param filters - Optional filters (category, search, etc.)
   */
  async fetchFeed(
    pageSize: number = 20,
    cursor?: string,
    filters?: { category?: string; search?: string; userId?: string }
  ): Promise<FeedResponse> {
    const cacheKey = `feed-${cursor || 'initial'}-${JSON.stringify(filters)}`;

    // Return cached request if already in flight
    if (this.requestCache.has(cacheKey)) {
      return this.requestCache.get(cacheKey)!;
    }

    const request = this.api
      .get<FeedResponse>('/pins/feed', {
        params: {
          limit: pageSize,
          cursor,
          ...filters,
        }
      })
      .then(response => {
        // Cache the result
        const cacheKeySimple = `feed-${cursor || 'initial'}`;
        if (!this.cache.has(cacheKeySimple)) {
          this.cache.set(cacheKeySimple, response.data.pins);
        }
        return response.data;
      })
      .finally(() => {
        // Remove from request cache after completion
        this.requestCache.delete(cacheKey);
      });

    this.requestCache.set(cacheKey, request);
    return request;
  }

  /**
   * Fetch a single pin with details
   */
  async fetchPin(pinId: string): Promise<Pin> {
    return this.api
      .get<Pin>(`/pins/${pinId}`)
      .then(response => response.data);
  }

  /**
   * Like a pin
   */
  async likePin(pinId: string): Promise<{ success: boolean; likes: number }> {
    return this.api
      .post(`/pins/${pinId}/like`)
      .then(response => response.data);
  }

  /**
   * Save pin to board
   */
  async savePin(pinId: string, boardId: string): Promise<{ success: boolean }> {
    return this.api
      .post(`/pins/${pinId}/save`, { boardId })
      .then(response => response.data);
  }

  /**
   * Mock data generator for development
   */
  static generateMockPins(count: number): Pin[] {
    const titles = [
      'Beautiful Sunset', 'Mountain View', 'Ocean Waves', 'Forest Path',
      'City Lights', 'Desert Dunes', 'Snow Peak', 'Tropical Beach'
    ];

    const descriptions = [
      'Amazing landscape photography',
      'Nature at its best',
      'Travel inspiration',
      'Adventure awaits',
      'Peaceful scenery'
    ];

    const userNames = ['Sarah Designer', 'John Photographer', 'Emma Travel', 'Alex Art'];

    return Array.from({ length: count }, (_, i) => ({
      id: `pin-${i}`,
      title: titles[i % titles.length],
      description: descriptions[i % descriptions.length],
      imageUrl: `https://picsum.photos/seed/${i}/300/${200 + (i % 3) * 100}`,
      imageHeight: 200 + (i % 3) * 100,
      imageWidth: 300,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      likes: Math.floor(Math.random() * 10000),
      boardName: `Board ${(i % 4) + 1}`,
      userName: userNames[i % userNames.length],
      userId: `user-${i % 4}`,
      avatarUrl: `https://i.pravatar.cc/48?img=${i % 20}`,
    }));
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    this.requestCache.clear();
  }
}

export default new PinterestApiService();
