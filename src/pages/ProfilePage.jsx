import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Trash2, Edit, Save, X } from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user, isUpdatingProfile, updateProfile, deleteAccount } =
    useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");

  // Update newName when user data changes
  useEffect(() => {
    setNewName(user?.name || "");
  }, [user?.name]);

  const handleDeleteAccount = async () => {
    const confirmMessage =
      "Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data including messages and profile information.";

    if (window.confirm(confirmMessage)) {
      const doubleConfirm = window.confirm(
        "This is your final warning. Are you absolutely sure you want to delete your account?"
      );

      if (doubleConfirm) {
        await deleteAccount();
      }
    }
  };

  const handleNameUpdate = async () => {
    if (!newName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    if (newName.trim() === user?.name) {
      setIsEditingName(false);
      return;
    }

    // Create FormData with just the name
    const formData = new FormData();
    formData.append("name", newName.trim());

    await updateProfile(formData);
    setIsEditingName(false);
  };

  const handleCancelNameEdit = () => {
    setNewName(user?.name || "");
    setIsEditingName(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("avatar", file);

    // Set preview image
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImg(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload file
    await updateProfile(formData);
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || user.avatar || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              {isEditingName ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex-1 input input-bordered input-sm"
                    placeholder="Enter your name"
                    disabled={isUpdatingProfile}
                  />
                  <button
                    onClick={handleNameUpdate}
                    className="btn btn-success btn-sm"
                    disabled={isUpdatingProfile}
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancelNameEdit}
                    className="btn btn-ghost btn-sm"
                    disabled={isUpdatingProfile}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="flex-1 px-4 py-2.5 bg-base-200 rounded-lg border">
                    {user?.name}
                  </p>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="btn btn-ghost btn-sm"
                    disabled={isUpdatingProfile}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{user.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-xl p-6">
            <h2 className="text-lg font-medium text-red-400 mb-4">
              Danger Zone
            </h2>
            <div className="space-y-3">
              <p className="text-sm text-zinc-400">
                Once you delete your account, there is no going back. This will
                permanently delete your profile, messages, and all associated
                data.
              </p>
              <button
                onClick={handleDeleteAccount}
                className="btn btn-error btn-sm gap-2 hover:btn-error"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
