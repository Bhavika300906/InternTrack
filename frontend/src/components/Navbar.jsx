import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getProfile, logoutUser } from "../services/authService";

function Navbar() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [profileVersion, setProfileVersion] = useState(Date.now());

  // -----------------------------
  // Load Profile
  // -----------------------------

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();

        console.log("Navbar profile:", data);

        setProfile(data);
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    };

    // Load profile when Navbar first opens
    loadProfile();

    // Listen for profile changes from Settings
    const handleProfileUpdate = (event) => {
      const updatedProfile = event.detail;

      if (updatedProfile) {
        setProfile(updatedProfile);
        setProfileVersion(Date.now());
      }
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, []);

  // -----------------------------
  // Logout
  // -----------------------------

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const username =
    profile?.username ||
    JSON.parse(localStorage.getItem("user") || "{}")?.username ||
    "User";

  const displayName = profile?.name || username;

  // API already returns the complete URL
  const profileImage = profile?.profile_picture
    ? `${profile.profile_picture}?v=${profileVersion}`
    : "";

  return (
    <header className="navbar">
      <div className="navbar-logo">InternTrack</div>

      <div className="navbar-actions">
        {/* Profile */}

        <div
          className="navbar-profile"
          onClick={() => navigate("/settings")}
          title="Open Settings"
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="navbar-profile-picture"
            />
          ) : (
            <div className="navbar-profile-placeholder">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}

          <span className="navbar-greeting">Hi, {displayName}</span>
        </div>

        {/* Add Application */}

        <button
          type="button"
          className="add-button"
          onClick={() => navigate("/add-application")}
        >
          + Add Application
        </button>

        {/* Logout */}

        <button type="button" className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
