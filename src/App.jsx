import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import RegisterForm from './form/RegistartionForm'
import LoginForm from './form/LoginForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <RegisterForm />
    <LoginForm />
    </>
  )
}

export default App
