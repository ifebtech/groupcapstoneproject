import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Tasks from '../components/Tasks';
import MainLayout from '../layouts/MainLayout';

const Home = () => {
  const authState = useSelector(state => state.authReducer);
  const { isLoggedIn } = authState;
  
  const teamMembers = [
    "Ayotomiwa-Odunayo",
    "Chidimma-Okafor",
    "Derrick-Kojo",
    "Esther-Isreal-Olawepo (GROUP HEAD)",
    "Ifeanyi-Ogbonnaya",
    "Marcelinus-Saliu",
    "Ojo-Yusuf",
    "Oyinye-Nwosu",
    "Shotade-Razaq",
    "Timilehin-Adeyeye",
    "Ene-Victoria",
    "Adeyemi-Sodiq",
    "Oluwajimi-Olawale",
    "Oluwajimi-Kolawale",
    "Ogbuoshi-Paul",
    "Bright-Kofi",
    "Anyiam-Emmanuel",
    "Ejionye-Sylvaline"
  ];

  useEffect(() => {
    document.title = authState.isLoggedIn ? `${authState.user.name}'s Tasks - CC Group 4` : "Cloud Computing Group 4 Project";
  }, [authState]);

  return (
    <>
      <MainLayout>
        {!isLoggedIn ? (
          <>
            <div className='bg-gradient-to-r from-blue-600 to-blue-800 text-white h-[50vh] py-16 text-center flex flex-col justify-center items-center'>
              <h1 className='text-4xl font-bold mb-4'>☁️ Cloud Computing Group 4</h1>
              <h2 className='text-2xl font-semibold mb-2'>Collaborative Task Manager</h2>
              <p className='text-lg mb-8 max-w-2xl'>Streamline your group projects with our intelligent task management system. Collaborate seamlessly with your team members.</p>
              <Link to="/signup" className='mt-6 bg-yellow-400 text-gray-800 font-bold py-3 px-8 rounded-lg hover:bg-yellow-500 transition transform hover:scale-105 inline-flex items-center gap-2'>
                <span>Get Started Now</span>
                <span><i className="fa-solid fa-arrow-right"></i></span>
              </Link>
            </div>

            {/* Team Members Section */}
            <div className='bg-white py-12 px-8'>
              <div className='max-w-6xl mx-auto'>
                <h2 className='text-3xl font-bold text-center text-blue-800 mb-2'>👥 Our Team</h2>
                <p className='text-center text-gray-600 mb-8'>Cloud Computing Group 4 Members</p>
                
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {teamMembers.map((member, index) => (
                    <div key={index} className={`p-4 rounded-lg border-l-4 transition transform hover:scale-105 ${
                      member.includes('GROUP HEAD') 
                        ? 'bg-yellow-50 border-yellow-400 shadow-md' 
                        : 'bg-blue-50 border-blue-400 shadow-sm'
                    }`}>
                      <p className={`font-semibold ${member.includes('GROUP HEAD') ? 'text-yellow-700' : 'text-blue-700'}`}>
                        {member.includes('GROUP HEAD') ? '⭐ ' : '✓ '}{member}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className='text-2xl font-bold mt-8 mx-8 pb-4 border-b-2 border-blue-600'>Welcome back, {authState.user.name}! 👋</h1>
            <p className='text-gray-600 mx-8 mt-2'>Cloud Computing Group 4 - Task Management Hub</p>
            <Tasks />
          </>
        )}
      </MainLayout>
    </>
  )
}

export default Home