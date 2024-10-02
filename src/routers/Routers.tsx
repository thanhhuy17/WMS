import React from 'react'
import AuthRouter from './AuthRouter'
import MainRouter from './MainRouter'

const Routers = () => {
  return (
    1 < 2 ? <AuthRouter/> : <MainRouter/>
  )
}

export default Routers