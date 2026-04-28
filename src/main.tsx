import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GalleryProvider } from './utils/galleryContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GalleryProvider>
      <App />
    </GalleryProvider>
  </StrictMode>,
)
