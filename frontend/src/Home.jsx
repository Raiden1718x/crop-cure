import { useState } from 'react'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import CropAnalysis from './components/CropAnalysis'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className='relative min-h-screen w-screen overflow-x-hidden'>
      <Navbar />
      <Hero />
      <CropAnalysis />
    </main>
  )
}

export default App

