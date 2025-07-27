import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../../lib/axios.js'
import profilePic from '../../assets/profile.png'

const ProfileField = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
    <p className="text-sm font-semibold text-gray-500 capitalize">{label}</p>
    <p className="text-md text-gray-800">{value || 'N/A'}</p>
  </div>
)

const ProfileHeader = ({ user }) => (
  <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-gray-200">
    <img
      src={user.avatarUrl || profilePic}
      alt="Profile"
      className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
    />
    <div>
      <h2 className="text-3xl font-bold text-gray-800">{user.name ?? 'N/A'}</h2>
      <p className="text-md text-gray-500">{user.role || 'User'}</p>
    </div>
  </div>
)

const ProfileDetails = ({ user }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
    <ProfileField label="Name" value={user.name} />
    <ProfileField label="Email" value={user.email} />
    <ProfileField label="Phone Number" value={user.phone} />
    <ProfileField label="Type of Food Sold" value={user.foodType} />
  </div>
)

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('/auth/profile')
        // console.log(res.data)
        setProfile(res.data)
      } catch (err) {
        console.error('Failed to load profile:', err.message)
        setError('Could not load profile data. Please try again later.')
      }
    }
    fetchProfile()
  }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-6 text-center text-red-500 bg-red-50 rounded-lg">{error}</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-6 text-center text-gray-600">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-8 bg-white shadow-lg rounded-xl mt-10">
      <ProfileHeader user={profile.user} />
      <ProfileDetails user={profile.user} />
    </div>
  )
}
