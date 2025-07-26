import React from "react";
import { useAuthStore } from "../../store/useAuthStore";

const Profile = () => {
  const {authUser} = useAuthStore();
  const user = authUser

  if (!user) {
    return <div className="text-center text-red-500 mt-10">Not logged in</div>;
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold mb-8">Profile</h2>

        <div className="flex flex-col md:flex-row items-center md:items-start bg-[#1b1b1b] p-6 rounded-2xl shadow-lg">
          {/* Avatar */}
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-700 mb-6 md:mb-0 md:mr-10">
            <img
              src="https://cdn.dribbble.com/userupload/42550372/file/original-49d352bf1fc7a4c2a8ca4afba4f70d4f.png?resize=752x&vertical=center" // Replace with user's profile pic if available
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Bio & Details */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white">{user.name}</h3>
            <p className="text-sm text-gray-400 mt-1">Vendor Profile</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-sm text-gray-300">
              <div>
                <span className="text-gray-500">Email:</span>
                <p>{user.email}</p>
              </div>
              <div>
                <span className="text-gray-500">Phone:</span>
                <p>{user.phone || "N/A"}</p>
              </div>
              <div>
                <span className="text-gray-500">Location:</span>
                <p>{user.location || "N/A"}</p>
              </div>
              <div>
                <span className="text-gray-500">Food Type:</span>
                <p>{user.foodType || "N/A"}</p>
              </div>
            </div>

            <div className="mt-4">
              <span className="text-gray-500">Role:</span>
              <p className="text-green-400 font-medium">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
