import { Outlet } from "react-router-dom"
import NavBar from "../components/NavBar"

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="mx-3 pb-8 md:mx-10 lg:mx-20">
        <Outlet />
      </main>
    </div>
  )
}
export default Layout