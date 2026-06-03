import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'

// Dismiss the HTML page-loader once the React tree mounts
const dismissPageLoader = () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    // Give a tiny paint frame so the first React render is visible
    requestAnimationFrame(() => {
      loader.classList.add('loaded');
      // Remove from DOM after transition
      setTimeout(() => loader.remove(), 700);
    });
  }
};

const root = createRoot(document.getElementById('root')!);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);

// Fire after initial paint
if (document.readyState === 'complete') {
  dismissPageLoader();
} else {
  window.addEventListener('load', dismissPageLoader, { once: true });
}
