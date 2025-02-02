import { RouterProvider } from 'react-router-dom'
import { router } from '@/router/routes'
import { Suspense } from 'react'

function App() {
  if (!router) {
    return <div>Loading...</div>
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default App
