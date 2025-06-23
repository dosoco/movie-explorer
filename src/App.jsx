import React from 'react'
import './App.css'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import MovieContainer from './components/movies/MovieContainer'

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <MovieContainer />
      </main>
      <Footer />
    </div>
  )
}

export default App