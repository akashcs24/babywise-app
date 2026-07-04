import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

function initClarity() {
  const projectId = 'xh37pk6whc'
  if (!projectId || typeof window === 'undefined' || typeof document === 'undefined') return
  if (document.getElementById('ms-clarity-script')) return

  ;(function (c, l, a, r, i, t, y) {
    c[a] =
      c[a] ||
      function () {
        ;(c[a].q = c[a].q || []).push(arguments)
      }
    t = l.createElement(r)
    t.id = 'ms-clarity-script'
    t.async = 1
    t.src = `https://www.clarity.ms/tag/${i}`
    y = l.getElementsByTagName(r)[0]
    y.parentNode.insertBefore(t, y)
  })(window, document, 'clarity', 'script', projectId)
}

initClarity()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
