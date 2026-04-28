import { useContext } from 'react';
import { GalleryContext } from './galleryContextValue';
import type { GalleryImage } from './apiClient';

export const useGallerySlot = (slot: string): GalleryImage | undefined => {
    const map = useContext(GalleryContext);
    return map[slot];
};
