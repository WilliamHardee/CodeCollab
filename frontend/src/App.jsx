
import Nav from './Components/Nav/Nav'
import Login from './Components/Authforms/Login'
import CodeWindow from './Components/CodeWindow/CodeWindow'
import CreateAccount from './Components/Authforms/CreateAccount'
import {Routes, Route} from 'react-router-dom'
import './App.css'
import ProjectList from './Components/ProjectList/ProjectList'
import LandingPage from './Components/Home/LandingPage'


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/CodeWindow/:id" element={<CodeWindow/>}/>
        <Route path="/ProjectList" element={<ProjectList/>}/>
      </Routes>
    </>
  )
}

export default App
