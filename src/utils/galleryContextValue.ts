import { createContext } from 'react';
import type { GalleryImage } from './apiClient';

export type GalleryMap = Record<string, GalleryImage>;

export const GalleryContext = createContext<GalleryMap>({});
