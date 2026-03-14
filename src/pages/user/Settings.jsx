import { useState, useEffect } from 'react'
import { getCurrentUser, getUserProfile, saveUserProfile } from '../../utils/storage'
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
  X
} from 'lucide-react'

const Settings = () => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [activeTab, setActiveTab] = useState('account')
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [settings, setSettings] = useState({
    // Account
    email: '',
    phone: '',
    // Privacy
    hidePhone: false,
    hidePhotos: false,
    profileVisibility: 'public',
    // Notifications
    emailNotifications: true,
    smsNotifications: true,
    interestAlerts: true,
    messageAlerts: true,
    profileViewAlerts: true,
  })

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      const userProfile = getUserProfile(currentUser.id)
      if (userProfile) {
        setProfile(userProfile)
        setSettings({
          email: currentUser.email || '',
          phone: userProfile.phone || '',
          hidePhone: userProfile.privacySettings?.showContactInfo === false,
          hidePhotos: userProfile.privacySettings?.showPhotosToEveryone === false,
          profileVisibility: userProfile.privacySettings?.profileVisibility || 'public',
          emailNotifications: userProfile.notificationSettings?.emailNotifications ?? true,
          smsNotifications: userProfile.notificationSettings?.smsNotifications ?? true,
          interestAlerts: userProfile.notificationSettings?.interestAlerts ?? true,
          messageAlerts: userProfile.notificationSettings?.messageAlerts ?? true,
          profileViewAlerts: userProfile.notificationSettings?.profileViewAlerts ?? true,
        })
      }
    }
  }, [])

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ]

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value })
    setSaved(false)
  }

  const handleSave = async () => {
    if (!user || !profile) return

    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))

    const updatedProfile = {
      ...profile,
      phone: settings.phone,
      privacySettings: {
        ...(profile.privacySettings || {}),
        showContactInfo: !settings.hidePhone,
        showPhotosToEveryone: !settings.hidePhotos,
        profileVisibility: settings.profileVisibility,
      },
      notificationSettings: {
        ...(profile.notificationSettings || {}),
        emailNotifications: settings.emailNotifications,
        smsNotifications: settings.smsNotifications,
        interestAlerts: settings.interestAlerts,
        messageAlerts: settings.messageAlerts,
        profileViewAlerts: settings.profileViewAlerts,
      },
    }
    saveUserProfile(user.id, updatedProfile)
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account settings and preferences</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {/* Account Settings */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      readOnly
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={settings.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <hr className="border-gray-100" />

                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <input
                        type="password"
                        placeholder="Enter current password"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Privacy Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">Hide Phone Number</p>
                      <p className="text-sm text-gray-500">Other users won't see your phone number</p>
                    </div>
                    <button
                      onClick={() => handleChange('hidePhone', !settings.hidePhone)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.hidePhone ? 'bg-primary-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                        settings.hidePhone ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">Hide Photos</p>
                      <p className="text-sm text-gray-500">Require approval for photo requests</p>
                    </div>
                    <button
                      onClick={() => handleChange('hidePhotos', !settings.hidePhotos)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.hidePhotos ? 'bg-primary-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                        settings.hidePhotos ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="font-medium text-gray-900 mb-3">Profile Visibility</p>
                    <div className="space-y-2">
                      {['public', 'members', 'premium'].map((option) => (
                        <label key={option} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="visibility"
                            value={option}
                            checked={settings.profileVisibility === option}
                            onChange={() => handleChange('profileVisibility', option)}
                            className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                          />
                          <span className="text-gray-700 capitalize">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive updates via email</p>
                    </div>
                    <button
                      onClick={() => handleChange('emailNotifications', !settings.emailNotifications)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.emailNotifications ? 'bg-primary-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                        settings.emailNotifications ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">SMS Notifications</p>
                      <p className="text-sm text-gray-500">Receive updates via SMS</p>
                    </div>
                    <button
                      onClick={() => handleChange('smsNotifications', !settings.smsNotifications)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.smsNotifications ? 'bg-primary-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                        settings.smsNotifications ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">Interest Alerts</p>
                      <p className="text-sm text-gray-500">Get notified when you receive interests</p>
                    </div>
                    <button
                      onClick={() => handleChange('interestAlerts', !settings.interestAlerts)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.interestAlerts ? 'bg-primary-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                        settings.interestAlerts ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">Message Alerts</p>
                      <p className="text-sm text-gray-500">Get notified for new messages</p>
                    </div>
                    <button
                      onClick={() => handleChange('messageAlerts', !settings.messageAlerts)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.messageAlerts ? 'bg-primary-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                        settings.messageAlerts ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">Profile View Alerts</p>
                      <p className="text-sm text-gray-500">Get notified when someone views your profile</p>
                    </div>
                    <button
                      onClick={() => handleChange('profileViewAlerts', !settings.profileViewAlerts)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.profileViewAlerts ? 'bg-primary-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                        settings.profileViewAlerts ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
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
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all disabled:opacity-70"
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
  )
}

export default Settings
