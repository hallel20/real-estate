import React from 'react';
import Button from '../../../components/ui/Button';

interface AuthStore {
  user: {
    username: string;
    email: string;
    profileImage?: string;
  };
}

type User = AuthStore['user'];

interface ProfileSettingsTabProps {
  user: User;
}

const ProfileSettingsTab: React.FC<ProfileSettingsTabProps> = ({ user }) => {
  // const { updateProfile } = useAuthStore(); // Example if implementing form submission

  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const formData = new FormData(event.currentTarget);
  //   const data = Object.fromEntries(formData.entries());
  //   // Call updateProfile(data) or similar
  //   console.log("Profile update data:", data);
  // };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Profile Settings
      </h2>

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* <form className="space-y-6" onSubmit={handleSubmit}> */}
        <form className="space-y-6"> {/* onSubmit removed as it's not implemented yet */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                defaultValue={user?.username}
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                defaultValue={user?.email}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              > New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Leave blank to keep current password"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              > Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Leave blank to keep current password"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="profileImage"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Profile Image URL
            </label>
            <input
              type="text"
              id="profileImage"
              name="profileImage"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              defaultValue={user?.profileImage || ''}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettingsTab;