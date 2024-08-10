import React from 'react'
import { Link } from 'react-router-dom'
const Home = () => {
  return (
    <>
    <nav>
      <h1>JCKAME</h1>
      <Link to='/logout'>Logout</Link>
    </nav>
    </>
  )
}

export default Home