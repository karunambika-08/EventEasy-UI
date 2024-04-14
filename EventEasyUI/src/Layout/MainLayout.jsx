import Header from "../components/Header"
import Outlet from 'react-router-dom'
function MainLayout() {
  return (
    <>
    <Header></Header>
    <Outlet></Outlet>
    </>
  )
}

export default MainLayout