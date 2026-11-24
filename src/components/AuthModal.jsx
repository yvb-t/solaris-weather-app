// ============================================================
// AuthModal.jsx — Login, Register & User Profile Modal for Solaris
// Glassmorphic design matching DailySky/Solaris dark aesthetic.
// Features: Sign In, Sign Up, Quick Demo login, Profile view,
// Favorite cities manager, unit preferences & sign out.
// ============================================================

import { useState } from "react";

function AuthModal({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  currentCity,
  onSelectCity,
  units,
  onToggleUnits
}) {
  const [tab, setTab] = useState(currentUser ? "profile" : "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [notification, setNotification] = useState("");
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("solaris_favorites");
      return saved ? JSON.parse(saved) : ["Kurchatov, RU", "Tokyo, JP", "London, GB"];
    } catch {
      return ["Kurchatov, RU", "Tokyo, JP", "London, GB"];
    }
  });

  if (!isOpen) return null;

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please enter both email and password.");
      return;
    }
    const username = email.split("@")[0];
    const userObj = {
      name: username.charAt(0).toUpperCase() + username.slice(1),
      email,
      avatar: "⚡",
      role: "Sky Explorer"
    };
    onLogin(userObj);
    showToast(`Welcome back, ${userObj.name}!`);
    setTab("profile");
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast("Please fill in all registration fields.");
      return;
    }
    const userObj = {
      name,
      email,
      avatar: "✨",
      role: "Atmospheric Member"
    };
    onLogin(userObj);
    showToast(`Account created for ${name}!`);
    setTab("profile");
  };

  const handleDemoLogin = () => {
    const demoUser = {
      name: "Alex Morgan",
      email: "alex@solaris.sky",
      avatar: "👨‍🚀",
      role: "Pro Meteorologist"
    };
    onLogin(demoUser);
    showToast("Signed in as Demo User (Alex Morgan)");
    setTab("profile");
  };

  const handleAddFavorite = () => {
    if (!currentCity) return;
    if (favorites.includes(currentCity)) {
      showToast(`${currentCity} is already in your favorites.`);
      return;
    }
    const updated = [...favorites, currentCity];
    setFavorites(updated);
    try {
      localStorage.setItem("solaris_favorites", JSON.stringify(updated));
    } catch (err) {
      console.warn(err);
    }
    showToast(`Added ${currentCity} to saved locations!`);
  };

  const handleRemoveFavorite = (cityToRemove) => {
    const updated = favorites.filter((c) => c !== cityToRemove);
    setFavorites(updated);
    try {
      localStorage.setItem("solaris_favorites", JSON.stringify(updated));
    } catch (err) {
      console.warn(err);
    }
    showToast(`Removed ${cityToRemove} from favorites.`);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* ── Modal Close Button ── */}
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* ── Notification Toast inside modal ── */}
        {notification && (
          <div className="modal-inline-toast">
            <span>{notification}</span>
          </div>
        )}

        {/* ── Tab Switcher ── */}
        <div className="auth-tab-bar">
          {!currentUser ? (
            <>
              <button
                type="button"
                className={`auth-tab-btn ${tab === "signin" ? "active" : ""}`}
                onClick={() => setTab("signin")}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`auth-tab-btn ${tab === "signup" ? "active" : ""}`}
                onClick={() => setTab("signup")}
              >
                Create Account
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className={`auth-tab-btn ${tab === "profile" ? "active" : ""}`}
                onClick={() => setTab("profile")}
              >
                My Profile
              </button>
              <button
                type="button"
                className={`auth-tab-btn ${tab === "favorites" ? "active" : ""}`}
                onClick={() => setTab("favorites")}
              >
                Saved Places ({favorites.length})
              </button>
            </>
          )}
        </div>

        {/* ── Tab 1: Sign In ── */}
        {!currentUser && tab === "signin" && (
          <form className="auth-form" onSubmit={handleSignIn}>
            <div className="auth-header-text">
              <h3>Welcome to Solaris</h3>
              <p>Sign in to sync your favorite cities, custom radar alerts & unit preferences.</p>
            </div>

            <div className="auth-field-group">
              <label>Email Address</label>
              <div className="auth-input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="auth-input-icon">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-field-group">
              <label>Password</label>
              <div className="auth-input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="auth-input-icon">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="auth-options-row">
              <label className="remember-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                className="forgot-link-btn"
                onClick={() => showToast("Password reset link sent to registered email!")}
              >
                Forgot password?
              </button>
            </div>

            <button type="submit" className="auth-submit-btn">
              Sign In to Dashboard
            </button>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <button
              type="button"
              className="demo-login-btn"
              onClick={handleDemoLogin}
            >
              <span className="demo-icon">👨‍🚀</span>
              <span>1-Click Demo Login (Alex Morgan)</span>
            </button>
          </form>
        )}

        {/* ── Tab 2: Sign Up ── */}
        {!currentUser && tab === "signup" && (
          <form className="auth-form" onSubmit={handleSignUp}>
            <div className="auth-header-text">
              <h3>Create Your Solaris Account</h3>
              <p>Experience hyper-localized forecasts, live atmospheric radar, and cross-device sync.</p>
            </div>

            <div className="auth-field-group">
              <label>Full Name</label>
              <div className="auth-input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="auth-input-icon">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-field-group">
              <label>Email Address</label>
              <div className="auth-input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="auth-input-icon">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  type="email"
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-field-group">
              <label>Create Password</label>
              <div className="auth-input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="auth-input-icon">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">
              Create Solaris Account
            </button>
          </form>
        )}

        {/* ── Tab 3: Profile View ── */}
        {currentUser && tab === "profile" && (
          <div className="profile-view-content">
            <div className="profile-header-card">
              <div className="profile-avatar-circle">
                <span>{currentUser.avatar || "👤"}</span>
              </div>
              <div className="profile-identity">
                <h4>{currentUser.name}</h4>
                <p>{currentUser.email}</p>
                <span className="profile-role-badge">{currentUser.role || "Pro Member"}</span>
              </div>
            </div>

            <div className="profile-settings-section">
              <h5>Preferences & Atmospheric Sync</h5>

              <div className="profile-setting-item">
                <div className="setting-label-group">
                  <strong>Measurement Units</strong>
                  <p>Toggle between metric (°C, km/h) and imperial (°F, mph)</p>
                </div>
                <button
                  type="button"
                  className="unit-switch-pill"
                  onClick={onToggleUnits}
                >
                  {units === "metric" ? "°C / km/h" : "°F / mph"}
                </button>
              </div>

              <div className="profile-setting-item">
                <div className="setting-label-group">
                  <strong>Severe Weather Alerts</strong>
                  <p>Live thunderstorm, heavy rain and wind warnings</p>
                </div>
                <span className="status-badge-active">Enabled</span>
              </div>

              <div className="profile-setting-item">
                <div className="setting-label-group">
                  <strong>Current Location</strong>
                  <p>{currentCity || "Kurchatov, RU"}</p>
                </div>
                <button
                  type="button"
                  className="favorite-add-btn"
                  onClick={handleAddFavorite}
                >
                  Save as Favorite
                </button>
              </div>
            </div>

            <div className="profile-actions-row">
              <button
                type="button"
                className="profile-logout-btn"
                onClick={() => {
                  onLogout();
                  showToast("Signed out successfully.");
                  setTab("signin");
                }}
              >
                Sign Out
              </button>
              <button
                type="button"
                className="profile-done-btn"
                onClick={onClose}
              >
                Back to Weather
              </button>
            </div>
          </div>
        )}

        {/* ── Tab 4: Saved Favorite Cities ── */}
        {currentUser && tab === "favorites" && (
          <div className="favorites-view-content">
            <div className="favorites-header">
              <h4>Saved Locations ({favorites.length})</h4>
              <button
                type="button"
                className="add-fav-quick-btn"
                onClick={handleAddFavorite}
              >
                + Add Current ({currentCity})
              </button>
            </div>

            <div className="favorites-list">
              {favorites.map((cityName, idx) => (
                <div key={idx} className="favorite-item-row">
                  <div
                    className="fav-name-click"
                    onClick={() => {
                      onSelectCity(cityName);
                      onClose();
                    }}
                  >
                    <span className="fav-pin">📍</span>
                    <span className="fav-text">{cityName}</span>
                  </div>
                  <button
                    type="button"
                    className="fav-delete-btn"
                    onClick={() => handleRemoveFavorite(cityName)}
                    title="Remove from favorites"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="profile-done-btn"
              onClick={onClose}
              style={{ marginTop: "18px" }}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthModal;
