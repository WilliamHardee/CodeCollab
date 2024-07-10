import Home from './Components/Home/Home'
import Nav from './Components/Nav/Nav'
import Login from './Components/Authforms/Login'
import CreateAccount from './Components/Authforms/CreateAccount'
import {Routes, Route} from 'react-router-dom'
import './App.css'

function App() {

  return (
    <>
      <Nav/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/Login" element={<Login/>}/>
        <Route path="/CreateAccount" element={<CreateAccount/>}/>
      </Routes>
    </>
  )
}

export default App
