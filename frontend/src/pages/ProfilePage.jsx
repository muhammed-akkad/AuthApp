import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function ProfilePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/')
      return
    }

    fetch('http://localhost:3000/auth/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
        } else {
          alert(data.message || 'Could not fetch profile')
          navigate('/')
        }
      })
      .catch(err => {
        console.error('Profile error:', err)
        navigate('/')
      })
  }, [navigate])

  if (!user) {
    return <div>Loading profile...</div>
  }

  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <h1 className="text-2xl">Welcome {user.username}</h1>
      <button
        onClick={() => {
          localStorage.removeItem('token');
          navigate('/');
        }}
        className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  )
}

export default ProfilePage
