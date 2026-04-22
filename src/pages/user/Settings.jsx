import { useState, useEffect } from "react";
import {
  getSettings,
  updateSettings,
  changePassword,
  deleteAccount,
} from "../../api/userApi/userApi";
import toast from "react-hot-toast";
import {
  User,
  Bell,
  Eye,
  Shield,
  Save,
  Loader2,
  Check,
  Mail,
  Phone,
  Image,
  Users,
  X,
} from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [settings, setSettings] = useState({
    // Account
    email: "",
    phone: "",
    // Privacy
    hidePhone: false,
    hidePhotos: false,
    profileVisibility: "public",
    // Notifications
    emailNotifications: true,
    smsNotifications: true,
    interestAlerts: true,
    messageAlerts: true,
    profileViewAlerts: true,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();

        setSettings({
          email: data.email || "",
          phone: data.phone || "",
          hidePhone: data.privacySettings?.hidePhone || false,
          hidePhotos: data.privacySettings?.hidePhotos || false,
          profileVisibility:
            data.privacySettings?.profileVisibility || "public",
          emailNotifications:
            data.notificationSettings?.emailNotifications ?? true,
          smsNotifications: data.notificationSettings?.smsNotifications ?? true,
          interestAlerts: data.notificationSettings?.interestAlerts ?? true,
          messageAlerts: data.notificationSettings?.messageAlerts ?? true,
          profileViewAlerts:
            data.notificationSettings?.profileViewAlerts ?? true,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchSettings();
  }, []);
  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  const handleChange = async (key, value, persist = false) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    setSaved(false);

    if (persist) {
      try {
        const payload = { [key]: value };
        const res = await updateSettings(payload);
        toast.success(res?.message || "Setting updated");
      } catch (err) {
        const msg =
          err?.message || err?.response?.data?.message || "Update failed";
        toast.error(msg);
      }
    }
  };

  const handlePasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      toast.success(res?.message || "Password updated");
      // clear password fields
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      const msg =
        err?.message ||
        err?.response?.data?.message ||
        "Error updating password";
      toast.error(msg);
    }
  };
  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await updateSettings(settings);

      toast.success(res?.message || "Settings saved");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error(error);
      const msg =
        error?.message || error?.response?.data?.message || "Save failed";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary-50 text-primary-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {/* Account Settings */}
            {activeTab === "account" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Account Settings
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      readOnly
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={settings.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <hr className="border-gray-100" />

                <div className="pt-6">
                  <h3 className="text-md font-semibold text-gray-900 mb-4">
                    Danger Zone
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Deleting your account is permanent. All your data will be removed and this action cannot be undone.
                  </p>
                  <button
                    onClick={async () => {
                      const ok = window.confirm(
                        "Are you sure you want to delete your account? This action is irreversible.",
                      );
                      if (!ok) return;

                      try {
                        const res = await deleteAccount();
                        toast.success(res?.message || "Account deleted");
                        // clear auth and redirect to home
                        localStorage.removeItem("authToken");
                        window.location.href = "/";
                      } catch (err) {
                        const msg =
                          err?.message || err?.response?.data?.message || "Delete failed";
                        toast.error(msg);
                      }
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold"
                  >
                    Delete My Account
                  </button>
                </div>

                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-4">
                    Change Password
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter current password"
                        value={passwords.currentPassword}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        value={passwords.newPassword}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        value={passwords.confirmPassword}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === "privacy" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Privacy Settings
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">
                        Hide Phone Number
                      </p>
                      <p className="text-sm text-gray-500">
                        Other users won't see your phone number
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleChange("hidePhone", !settings.hidePhone, true)
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors overflow-hidden ${
                        settings.hidePhone ? "bg-blue-600" : "bg-gray-300"
                      }`}
                      aria-pressed={settings.hidePhone}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                          settings.hidePhone ? "left-6" : "left-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">Hide Photos</p>
                      <p className="text-sm text-gray-500">
                        Require approval for photo requests
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleChange("hidePhotos", !settings.hidePhotos, true)
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors overflow-hidden ${
                        settings.hidePhotos ? "bg-blue-600" : "bg-gray-300"
                      }`}
                      aria-pressed={settings.hidePhotos}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                          settings.hidePhotos ? "left-6" : "left-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="font-medium text-gray-900 mb-3">
                      Profile Visibility
                    </p>
                    <div className="space-y-2">
                      {["public", "premium"].map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="visibility"
                            value={option}
                            checked={settings.profileVisibility === option}
                            onChange={() =>
                              handleChange("profileVisibility", option, true)
                            }
                            className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                          />
                          <span className="text-gray-700 capitalize">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Notification Preferences
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">
                        Email Notifications
                      </p>
                      <p className="text-sm text-gray-500">
                        Receive updates via email
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleChange(
                          "emailNotifications",
                          !settings.emailNotifications,
                          true,
                        )
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors overflow-hidden ${
                        settings.emailNotifications
                          ? "bg-blue-600"
                          : "bg-gray-300"
                      }`}
                      aria-pressed={settings.emailNotifications}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                          settings.emailNotifications ? "left-6" : "left-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">
                        SMS Notifications
                      </p>
                      <p className="text-sm text-gray-500">
                        Receive updates via SMS
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleChange(
                          "smsNotifications",
                          !settings.smsNotifications,
                          true,
                        )
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors overflow-hidden ${
                        settings.smsNotifications
                          ? "bg-blue-600"
                          : "bg-gray-300"
                      }`}
                      aria-pressed={settings.smsNotifications}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                          settings.smsNotifications ? "left-6" : "left-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">
                        Interest Alerts
                      </p>
                      <p className="text-sm text-gray-500">
                        Get notified when you receive interests
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleChange(
                          "interestAlerts",
                          !settings.interestAlerts,
                          true,
                        )
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors overflow-hidden ${
                        settings.interestAlerts ? "bg-blue-600" : "bg-gray-300"
                      }`}
                      aria-pressed={settings.interestAlerts}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                          settings.interestAlerts ? "left-6" : "left-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">
                        Message Alerts
                      </p>
                      <p className="text-sm text-gray-500">
                        Get notified for new messages
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleChange(
                          "messageAlerts",
                          !settings.messageAlerts,
                          true,
                        )
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors overflow-hidden ${
                        settings.messageAlerts ? "bg-blue-600" : "bg-gray-300"
                      }`}
                      aria-pressed={settings.messageAlerts}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                          settings.messageAlerts ? "left-6" : "left-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">
                        Profile View Alerts
                      </p>
                      <p className="text-sm text-gray-500">
                        Get notified when someone views your profile
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleChange(
                          "profileViewAlerts",
                          !settings.profileViewAlerts,
                          true,
                        )
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors overflow-hidden ${
                        settings.profileViewAlerts
                          ? "bg-blue-600"
                          : "bg-gray-300"
                      }`}
                      aria-pressed={settings.profileViewAlerts}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                          settings.profileViewAlerts ? "left-6" : "left-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : saved ? (
                  <>
                    <Check className="w-5 h-5" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
