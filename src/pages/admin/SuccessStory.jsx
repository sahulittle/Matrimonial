import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiX,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiImage,
} from "react-icons/fi";
import {
  getSuccessStories,
  createSuccessStory,
  updateSuccessStory,
  deleteSuccessStory,
} from "../../api/adminApi/adminApi";

const SuccessStories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [formData, setFormData] = useState({
    brideName: "",
    groomName: "",
    img: "",
    imageFile: null,
    description: "",
  });

  const [stories, setStories] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getSuccessStories();
        setStories(res || []);
      } catch (err) {
        console.error("Error loading success stories:", err);
      }
    };
    fetch();
  }, []);

  const filteredStories = stories.filter(
    (story) =>
      `${story.brideName} & ${story.groomName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      story.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const openAddModal = () => {
    setEditingStory(null);
    setFormData({ brideName: "", groomName: "", img: "", description: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (story) => {
    setEditingStory(story);
    setFormData({
      brideName: story.brideName,
      groomName: story.groomName,
      description: story.description,
      imageFile: null,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStory(null);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        imageFile: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append("brideName", formData.brideName);
      payload.append("groomName", formData.groomName);
      payload.append("description", formData.description);
      if (formData.imageFile) payload.append("image", formData.imageFile);

      if (editingStory) {
        const updated = await updateSuccessStory(
          editingStory._id || editingStory.id,
          payload,
        );
        // replace
        setStories((prev) =>
          prev.map((s) =>
            s._id === (updated._id || updated.id) ? updated : s,
          ),
        );
      } else {
        const created = await createSuccessStory(payload);
        setStories((prev) => [created, ...prev]);
      }

      closeModal();
    } catch (err) {
      console.error("Error saving story:", err);
      alert("Failed to save story");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    try {
      await deleteSuccessStory(id);
      setStories((prev) => prev.filter((s) => s._id !== id && s.id !== id));
    } catch (err) {
      console.error("Failed to delete story:", err);
      alert("Failed to delete story");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h4 className="text-2xl font-bold text-gray-800">
            Success Stories Management
          </h4>
          <p className="text-sm text-gray-500 mt-1">
            Manage and publish beautiful journeys of MatriLab couples
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <input
              type="text"
              placeholder="Search stories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center bg-pink-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-pink-700 transition-colors whitespace-nowrap font-medium"
          >
            <FiPlus className="mr-2" /> Add New Story
          </button>
        </div>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto border rounded-xl">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Couple Image
              </th>
              <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Bride & Groom
              </th>
              <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                The Story
              </th>
              <th className="py-4 px-6 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700 divide-y divide-gray-100">
            {filteredStories.length > 0 ? (
              filteredStories.map((story) => (
                <tr
                  key={story._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <img
                      src={story.image}
                      alt={story.brideName}
                      className="w-20 h-14 object-cover rounded-lg shadow-sm border border-gray-100"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-gray-800">
                      {story.brideName} & {story.groomName}
                    </div>
                    <div className="text-xs text-pink-500 font-semibold uppercase mt-1">
                      Verified Story
                    </div>
                  </td>
                  <td className="py-4 px-6 max-w-md">
                    <p className="line-clamp-2 text-sm text-gray-600 leading-relaxed">
                      {story.description}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-center items-center gap-4">
                      <button
                        onClick={() => openEditModal(story)}
                        className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        title="Edit Story"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(story._id)}
                        className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        title="Delete Story"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-16 text-gray-400 italic"
                >
                  No success stories found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
              <h4 className="text-2xl font-bold text-gray-800">
                {editingStory ? "Edit" : "Create New"} Success Story
              </h4>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">
                    Bride Name
                  </label>
                  <input
                    type="text"
                    name="brideName"
                    value={formData.brideName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-gray-50/50"
                    placeholder="e.g. Priya"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">
                    Groom Name
                  </label>
                  <input
                    type="text"
                    name="groomName"
                    value={formData.groomName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-gray-50/50"
                    placeholder="e.g. Rohan"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">
                  Cover Image URL
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="img"
                    onChange={handleChange}
                    required
                    placeholder="https://images.unsplash.com/..."
                    className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-gray-50/50"
                  />
                  <FiImage className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">
                  Short Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-gray-50/50 resize-none"
                  placeholder="Tell their beautiful story in a few sentences..."
                />
              </div>
              <div className="pt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-8 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-pink-600 text-white font-bold rounded-xl shadow-lg hover:bg-pink-700 transform transition active:scale-95"
                >
                  {editingStory ? "Update Story" : "Publish Story"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuccessStories;
