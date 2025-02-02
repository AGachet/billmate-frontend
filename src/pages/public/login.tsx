/**
 * Resources
 */
import { auth } from '@/lib/auth'
import { useNavigate } from 'react-router-dom'

/**
 * Components
 */
import { Button } from '@/components/ui/button'

/**
 * React declaration
 */
export function Login() {
  const navigate = useNavigate()

  const handleLogin = () => {
    auth.setToken('fake-token')
    navigate('/dashboard')
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Button onClick={handleLogin}>Temporary Login</Button>
    </div>
  )
}
