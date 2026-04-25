import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Hero } from './components/Hero'

const root = document.getElementById('hero-root')
if (root) {
  createRoot(root).render(
    <StrictMode>
      <Hero />
    </StrictMode>
  )
}
