import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../redux/actions/authActions';
const Navbar = () => {
  const authState = useSelector(state => state.authReducer);
  const dispatch = useDispatch();
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  }
  const handleLogoutClick = () => {
    dispatch(logout());
  }
  return (
    <>
      <header className='flex justify-between sticky top-0 p-4 bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg items-center'>
        <h2 className='cursor-pointer font-bold text-white text-xl'>
          <Link to="/"> ☁️ CC Group 4 </Link>
        </h2>
        <ul className='hidden md:flex gap-4 uppercase font-medium text-white'>
          {authState.isLoggedIn ? (
            <>
              <li className="bg-yellow-400 text-gray-800 hover:bg-yellow-500 font-medium rounded-md transition transform hover:scale-105">
                <Link to='/tasks/add' className='block w-full h-full px-4 py-2'> <i className="fa-solid fa-plus"></i> Add Task </Link>
              </li>
              <li className='py-2 px-3 cursor-pointer hover:bg-blue-700 transition rounded-md' onClick={handleLogoutClick}>Logout</li>
            </>
          ) : (
            <li className='py-2 px-3 cursor-pointer bg-yellow-400 text-gray-800 hover:bg-yellow-500 transition rounded-md font-medium'><Link to="/login">Login</Link></li>
          )}
        </ul>
        <span className='md:hidden cursor-pointer text-white text-2xl' onClick={toggleNavbar}><i className="fa-solid fa-bars"></i></span>
        {/* Navbar displayed as sidebar on smaller screens */}
        <div className={`absolute md:hidden right-0 top-0 bottom-0 transition ${(isNavbarOpen === true) ? 'translate-x-0' : 'translate-x-full'} bg-blue-700 shadow-md w-screen sm:w-9/12 h-screen`}>
          <div className='flex'>
            <span className='m-4 ml-auto cursor-pointer text-white text-2xl' onClick={toggleNavbar}><i className="fa-solid fa-xmark"></i></span>
          </div>
          <ul className='flex flex-col gap-4 uppercase font-medium text-center text-white'>
            {authState.isLoggedIn ? (
              <>
                <li className="bg-yellow-400 text-gray-800 hover:bg-yellow-500 font-medium transition py-2 px-3 rounded-md">
                  <Link to='/tasks/add' className='block w-full h-full'> <i className="fa-solid fa-plus"></i> Add Task </Link>
                </li>
                <li className='py-2 px-3 cursor-pointer hover:bg-blue-600 transition rounded-md' onClick={handleLogoutClick}>Logout</li>
              </>
            ) : (
              <li className='py-2 px-3 cursor-pointer bg-yellow-400 text-gray-800 hover:bg-yellow-500 transition rounded-md'><Link to="/login">Login</Link></li>
            )}
          </ul>
        </div>
      </header>
    </>
  )
}
export default Navbar