import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AuthRedirectHandler } from 'components/features/auth/auth-redirect-handler.tsx'
import { AuthProvider } from 'components/features/auth/auth-provider.tsx'

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <AuthRedirectHandler />
    <App />
  </AuthProvider>
)
