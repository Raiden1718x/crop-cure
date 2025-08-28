import { useState } from 'react'
import Hero from './components/Hero'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className='relative min-h-screen w-screen overflow-x-hidden'>
      <Hero />
    </main>
  )
}

export default App
