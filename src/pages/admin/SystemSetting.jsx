import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiSettings,
  FiBell,
  FiGlobe,
  FiFileText,
} from "react-icons/fi";
import { adminReligionApi, adminPagesApi } from "../../services/api";
import {
  FaPuzzlePiece,
  FaCookieBite,
  FaSitemap,
  FaRobot,
} from "react-icons/fa";

const SystemSetting = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [aboutContent, setAboutContent] = React.useState("");
  const settings = [
    // Keep only the requested options and add an About Page dynamic card
    {
      icon: <FiSettings />,
      title: "General Setting",
      description: "Configure the fundamental information of the site.",
      color: "blue",
    },
    {
      icon: <FiBell />,
      title: "Notification Setting",
      description:
        "Control and configure overall notification elements of the system.",
      color: "red",
    },
    {
      icon: <FiGlobe />,
      title: "Manage Religions",
      description: "Add, edit or remove religions visible to users.",
      color: "teal",
    },
    {
      icon: <FiFileText />,
      title: "About Page",
      description: "Edit the dynamic About page content for the site.",
      color: "orange",
    },
  ];

  const filteredSettings = settings.filter(
    (setting) =>
      setting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      setting.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const colorClasses = {
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      border: "border-blue-500",
    },
    green: {
      bg: "bg-green-100",
      text: "text-green-600",
      border: "border-green-500",
    },
    purple: {
      bg: "bg-purple-100",
      text: "text-purple-600",
      border: "border-purple-500",
    },
    red: { bg: "bg-red-100", text: "text-red-600", border: "border-red-500" },
    indigo: {
      bg: "bg-indigo-100",
      text: "text-indigo-600",
      border: "border-indigo-500",
    },
    teal: {
      bg: "bg-teal-100",
      text: "text-teal-600",
      border: "border-teal-500",
    },
    pink: {
      bg: "bg-pink-100",
      text: "text-pink-600",
      border: "border-pink-500",
    },
    orange: {
      bg: "bg-orange-100",
      text: "text-orange-600",
      border: "border-orange-500",
    },
    cyan: {
      bg: "bg-cyan-100",
      text: "text-cyan-600",
      border: "border-cyan-500",
    },
    yellow: {
      bg: "bg-yellow-100",
      text: "text-yellow-600",
      border: "border-yellow-500",
    },
    lime: {
      bg: "bg-lime-100",
      text: "text-lime-600",
      border: "border-lime-500",
    },
    gray: {
      bg: "bg-gray-200",
      text: "text-gray-600",
      border: "border-gray-500",
    },
    amber: {
      bg: "bg-amber-100",
      text: "text-amber-600",
      border: "border-amber-500",
    },
  };

  const navigate = useNavigate();
  const [selected, setSelected] = React.useState(null);
  const [settingsObj, setSettingsObj] = React.useState({});

  const [religions, setReligions] = React.useState([]);
  const [newReligion, setNewReligion] = React.useState("");
  React.useEffect(() => {
    let mounted = true;
    adminReligionApi
      .list()
      .then((res) => {
        if (!mounted) return;
        const list = (res.data || res || []).map((r) => (r.name ? r : r));
        // res may be { success: true, data: [...] } from backend
        if (res.data && Array.isArray(res.data)) {
          setReligions(res.data.map((r) => r.name));
        } else if (Array.isArray(res)) {
          setReligions(res.map((r) => (r.name ? r.name : r)));
        } else {
          setReligions([]);
        }
      })
      .catch((err) => {
        console.error("Failed to load religions", err);
      });

    // load about page content if available
    adminPagesApi
      .getAbout()
      .then((res) => {
        if (!mounted) return;
        // accept multiple response shapes
        const content = (res && (res.data || res.content || res)) || "";
        if (typeof content === "object" && content.content) {
          setAboutContent(content.content);
        } else if (typeof content === "string") {
          setAboutContent(content);
        } else if (content.data && content.data.content) {
          setAboutContent(content.data.content);
        }
      })
      .catch(() => {
        // ignore if endpoint not available
      });

    return () => (mounted = false);
  }, []);

  const handleAddReligion = async () => {
    const name = newReligion.trim();
    if (!name) return;
    try {
      await adminReligionApi.create(name);
      // reload list
      const res = await adminReligionApi.list();
      setReligions(res.data.map((r) => r.name));
      setNewReligion("");
    } catch (e) {
      console.error("Add religion failed", e);
    }
  };

  const handleRemoveReligion = async (name) => {
    try {
      // find id by name
      const res = await adminReligionApi.list();
      const item = res.data.find((r) => r.name === name);
      if (!item) return;
      await adminReligionApi.remove(item._id);
      const updated = (await adminReligionApi.list()).data.map((r) => r.name);
      setReligions(updated);
    } catch (e) {
      console.error("Remove religion failed", e);
    }
  };

  const handleSaveAbout = async () => {
    try {
      await adminPagesApi.updateAbout(aboutContent);
      alert("About page updated.");
    } catch (e) {
      console.error("Failed to save about page", e);
      alert("Failed to save About page. See console for details.");
    }
  };

  const routeMap = {
    "General Setting": "/admin/extra/application",
    "Notification Setting": "/admin/users/send-notification",
    "Manage Religions": "/admin/system-setting#religions",
    "About Page": "/admin/system-setting#about",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h4 className="text-2xl font-bold text-gray-800">System Settings</h4>
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search settings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSettings.map((setting, index) => {
          const colors = colorClasses[setting.color] || colorClasses.gray;
          return (
            <div
              key={index}
              role="button"
              tabIndex={0}
              onClick={() => setSelected(setting.title)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  setSelected(setting.title);
              }}
              className={`bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-l-4 ${colors.border}`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-full ${colors.bg}`}>
                  <span className={`text-2xl ${colors.text}`}>
                    {setting.icon}
                  </span>
                </div>
                <div>
                  <h5 className="text-lg font-bold text-gray-800 mb-1">
                    {setting.title}
                  </h5>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {setting.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSettings.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">
            No settings found for "{searchTerm}"
          </p>
        </div>
      )}

      {/* Selected setting panel (shows when a card is clicked) */}
      {selected && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xl font-semibold">{selected}</h4>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelected(null)}
                className="px-3 py-1 border rounded"
              >
                Back
              </button>
            </div>
          </div>

          {selected === "General Setting" && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h5 className="font-semibold mb-2">General setting sections</h5>
              <p className="text-sm text-gray-600 mb-4">
                Quick links to general configuration areas in the admin panel.
              </p>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">Site settings (editable)</div>
                  <div className="text-sm text-gray-500">
                    Stored in admin settings
                  </div>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={async () => {
                      try {
                        const res = await adminSettingsApi.list();
                        const data = (res && (res.data || res)) || {};
                        setSettingsObj(data);
                      } catch (e) {
                        console.error("Failed to load settings", e);
                      }
                    }}
                    className="px-3 py-1 bg-gray-100 rounded"
                  >
                    Load Settings
                  </button>
                </div>
              </div>
              {Object.keys(settingsObj).length > 0 && (
                <div className="mb-4">
                  {Object.keys(settingsObj).map((k) => {
                    const val = settingsObj[k];
                    if (typeof val === "boolean") {
                      return (
                        <div key={k} className="flex items-center gap-3 mb-2">
                          <label className="text-sm w-40">{k}</label>
                          <input
                            type="checkbox"
                            checked={!!val}
                            onChange={(e) =>
                              setSettingsObj({
                                ...settingsObj,
                                [k]: e.target.checked,
                              })
                            }
                          />
                        </div>
                      );
                    }
                    return (
                      <div key={k} className="mb-2">
                        <label className="text-sm block mb-1">{k}</label>
                        <input
                          className="w-full p-2 border rounded"
                          value={String(val)}
                          onChange={(e) =>
                            setSettingsObj({
                              ...settingsObj,
                              [k]: e.target.value,
                            })
                          }
                        />
                      </div>
                    );
                  })}
                  <div className="mt-2">
                    <button
                      className="px-3 py-1 bg-pink-600 text-white rounded"
                      onClick={async () => {
                        try {
                          await adminSettingsApi.update(settingsObj);
                          alert("Settings saved");
                        } catch (e) {
                          console.error("Save settings failed", e);
                          alert("Save failed");
                        }
                      }}
                    >
                      Save Settings
                    </button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 border rounded flex items-center justify-between">
                  <div>
                    <div className="font-medium">Application</div>
                    <div className="text-sm text-gray-500">
                      Site title, logo, defaults
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/admin/extra/application")}
                    className="px-3 py-1 bg-pink-600 text-white rounded"
                  >
                    Open
                  </button>
                </div>
                <div className="p-3 border rounded flex items-center justify-between">
                  <div>
                    <div className="font-medium">Logo & Favicon</div>
                    <div className="text-sm text-gray-500">Upload assets</div>
                  </div>
                  <button
                    onClick={() => navigate("/admin/extra/server")}
                    className="px-3 py-1 bg-pink-600 text-white rounded"
                  >
                    Open
                  </button>
                </div>
                <div className="p-3 border rounded flex items-center justify-between">
                  <div>
                    <div className="font-medium">System Configuration</div>
                    <div className="text-sm text-gray-500">Cache, features</div>
                  </div>
                  <button
                    onClick={() => navigate("/admin/extra/cache")}
                    className="px-3 py-1 bg-pink-600 text-white rounded"
                  >
                    Open
                  </button>
                </div>
                <div className="p-3 border rounded flex items-center justify-between">
                  <div>
                    <div className="font-medium">SEO</div>
                    <div className="text-sm text-gray-500">
                      Meta tags and sitemap
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/admin/system-setting")}
                    className="px-3 py-1 bg-pink-600 text-white rounded"
                  >
                    Open
                  </button>
                </div>
              </div>
            </div>
          )}

          {selected === "Notification Setting" && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h5 className="font-semibold mb-2">Notification Settings</h5>
              <p className="text-sm text-gray-600 mb-4">
                Manage global notification behavior and send test notifications.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate("/admin/users/send-notification")}
                  className="px-4 py-2 bg-pink-600 text-white rounded"
                >
                  Open Notification Center
                </button>
              </div>
            </div>
          )}

          {selected === "Manage Religions" && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h5 className="font-semibold mb-4">Manage Religions</h5>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Add new religion"
                  value={newReligion}
                  onChange={(e) => setNewReligion(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded"
                />
                <button
                  onClick={handleAddReligion}
                  className="px-4 py-2 bg-pink-600 text-white rounded"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {religions.map((r) => (
                  <div
                    key={r}
                    className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded"
                  >
                    <span>{r}</span>
                    <button
                      onClick={() => handleRemoveReligion(r)}
                      className="text-red-600 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selected === "About Page" && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h5 className="font-semibold mb-2">About Page (Dynamic)</h5>
              <p className="text-sm text-gray-600 mb-2">
                Edit the content of the site's About page. This updates the
                dynamic content if your backend exposes the About page endpoint.
              </p>
              <textarea
                rows={8}
                value={aboutContent}
                onChange={(e) => setAboutContent(e.target.value)}
                className="w-full p-3 border rounded mb-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveAbout}
                  className="px-4 py-2 bg-pink-600 text-white rounded"
                >
                  Save About Page
                </button>
                <button
                  onClick={() => {
                    adminPagesApi
                      .getAbout()
                      .then((res) => {
                        const content =
                          (res && (res.data || res.content || res)) || "";
                        if (typeof content === "object" && content.content)
                          setAboutContent(content.content);
                        else if (typeof content === "string")
                          setAboutContent(content);
                        else if (content.data && content.data.content)
                          setAboutContent(content.data.content);
                      })
                      .catch(() => {});
                  }}
                  className="px-4 py-2 border rounded"
                >
                  Reload
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SystemSetting;
