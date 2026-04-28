import { useEffect, useState, type ReactNode } from 'react';
import { fetchGalleryPublicMap } from './apiClient';
import { GalleryContext, type GalleryMap } from './galleryContextValue';

export const GalleryProvider = ({ children }: { children: ReactNode }) => {
    const [map, setMap] = useState<GalleryMap>({});

    useEffect(() => {
        fetchGalleryPublicMap()
            .then((m) => setMap(m))
            .catch(() => setMap({}));
    }, []);

    return <GalleryContext.Provider value={map}>{children}</GalleryContext.Provider>;
};
