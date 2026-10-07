import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  getProfile,
  updateProfile,
  changePassword,
} from "../services/authService";

function Settings() {
  const navigate = useNavigate();

  // -----------------------------
  // Profile State
  // -----------------------------

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);

  // -----------------------------
  // Password State
  // -----------------------------

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [changingPassword, setChangingPassword] = useState(false);

  // -----------------------------
  // Load Profile
  // -----------------------------

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();

        console.log("Settings profile:", data);

        setProfile(data);

        setName(data.name || "");

        // API already returns the complete image URL
        setPreview(data.profile_picture || "");
      } catch (error) {
        console.error("Failed to load profile:", error);

        toast.error("Failed to load profile.");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  // -----------------------------
  // Profile Picture Change
  // -----------------------------

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile picture must be smaller than 5 MB.");
      return;
    }

    setProfilePicture(file);

    // Show selected image immediately
    const imageUrl = URL.createObjectURL(file);

    setPreview(imageUrl);
  };

  // -----------------------------
  // Save Profile
  // -----------------------------

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    try {
      setSavingProfile(true);

      const formData = new FormData();

      formData.append("name", name);

      if (profilePicture) {
        formData.append("profile_picture", profilePicture);
      }

      const updatedProfile = await updateProfile(formData);

      console.log("Updated profile:", updatedProfile);

      setProfile(updatedProfile);

      setName(updatedProfile.name || "");

      // API already returns complete image URL
      setPreview(updatedProfile.profile_picture || "");

      setProfilePicture(null);

      window.dispatchEvent(
        new CustomEvent("profileUpdated", {
          detail: updatedProfile,
        }),
      );
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);

      const errorMessage =
        error.response?.data?.profile_picture?.[0] ||
        error.response?.data?.name?.[0] ||
        "Failed to update profile.";

      toast.error(errorMessage);
    } finally {
      setSavingProfile(false);
    }
  };

  // -----------------------------
  // Password Input
  // -----------------------------

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  // -----------------------------
  // Change Password
  // -----------------------------

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (
      !passwordData.current_password ||
      !passwordData.new_password ||
      !passwordData.confirm_password
    ) {
      toast.error("Please fill in all password fields.");

      return;
    }

    if (passwordData.new_password.length < 8) {
      toast.error("New password must be at least 8 characters.");

      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error("New passwords do not match.");

      return;
    }

    try {
      setChangingPassword(true);

      await changePassword({
        current_password: passwordData.current_password,

        new_password: passwordData.new_password,
      });

      toast.success("Password changed successfully!");

      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      console.error("Failed to change password:", error);

      const errorMessage =
        error.response?.data?.error || "Failed to change password.";

      toast.error(errorMessage);
    } finally {
      setChangingPassword(false);
    }
  };

  // -----------------------------
  // Loading State
  // -----------------------------

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar />

        <div className="main-area">
          <Navbar />

          <main className="settings-page">
            <p>Loading settings...</p>
          </main>
        </div>
      </div>
    );
  }

  // -----------------------------
  // Settings Page
  // -----------------------------

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Navbar />

        <main className="settings-page">
          {/* Header */}

          <div className="settings-header">
            <div>
              <h1>Settings</h1>

              <p>Manage your profile and account security.</p>
            </div>

            <button
              type="button"
              className="back-button"
              onClick={() => navigate("/")}
            >
              ← Back to Dashboard
            </button>
          </div>

          {/* ========================= */}
          {/* Profile Section */}
          {/* ========================= */}

          <section className="settings-card">
            <div className="settings-card-header">
              <h2>Profile</h2>

              <p>Update your personal information and profile picture.</p>
            </div>

            <form className="profile-form" onSubmit={handleSaveProfile}>
              {/* Profile Picture */}

              <div className="profile-picture-section">
                <div className="profile-picture-wrapper">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile"
                      className="profile-picture"
                    />
                  ) : (
                    <div className="profile-picture-placeholder">
                      {(name || profile?.username || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="profile-picture-info">
                  <h3>Profile Picture</h3>

                  <p>Upload a JPG, JPEG, PNG, or WEBP image.</p>

                  <p>Maximum size: 5 MB</p>

                  <label
                    htmlFor="profile_picture"
                    className="change-picture-button"
                  >
                    Change Picture
                  </label>

                  <input
                    id="profile_picture"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    hidden
                  />
                </div>
              </div>

              {/* Name */}

              <div className="form-group ">
                <label htmlFor="name">Name</label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your name"
                  maxLength={150}
                />
              </div>

              {/* Username */}

              <div className="form-group">
                <label htmlFor="username">Username</label>

                <input
                  id="username"
                  type="text"
                  value={profile?.username || ""}
                  readOnly
                  className="readonly-input"
                />
              </div>

              {/* Email */}

              <div className="form-group">
                <label htmlFor="email">Email</label>

                <input
                  id="email"
                  type="email"
                  value={profile?.email || ""}
                  readOnly
                  className="readonly-input"
                />
              </div>

              {/* Save Button */}

              <button
                type="submit"
                className="settings-primary-button"
                disabled={savingProfile}
              >
                {savingProfile ? "Saving Profile..." : "Save Profile"}
              </button>
            </form>
          </section>

          {/* ========================= */}
          {/* Change Password */}
          {/* ========================= */}

          <section className="settings-card">
            <div className="settings-card-header">
              <h2>Change Password</h2>

              <p>Update your account password.</p>
            </div>

            <form className="settings-form" onSubmit={handleChangePassword}>
              {/* Current Password */}

              <div className="form-group">
                <label htmlFor="current_password">Current Password</label>

                <input
                  id="current_password"
                  name="current_password"
                  type="password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                />
              </div>

              {/* New Password */}

              <div className="form-group">
                <label htmlFor="new_password">New Password</label>

                <input
                  id="new_password"
                  name="new_password"
                  type="password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                />
              </div>

              {/* Confirm Password */}

              <div className="form-group">
                <label htmlFor="confirm_password">Confirm New Password</label>

                <input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                />
              </div>

              {/* Password Button */}

              <button
                type="submit"
                className="settings-primary-button"
                disabled={changingPassword}
              >
                {changingPassword ? "Changing Password..." : "Change Password"}
              </button>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Settings;
