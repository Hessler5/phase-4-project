import { Outlet } from 'react-router-dom'
import Header from "./Header";
import './App.css'

function App() {

  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default App;
