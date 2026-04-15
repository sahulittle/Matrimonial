import React, { useEffect, useState } from "react";
import { getPublicSuccessStories } from "../../../api/userApi/userApi";

// 🔹 Loading Placeholder
const PlaceholderCard = () => (
  <div className="animate-pulse rounded-2xl h-64 bg-gradient-to-r from-pink-100 via-white to-pink-100" />
);

// 🔹 Modal
// 🔹 Modal
const Modal = ({ open, onClose, story }) => {
  if (!open || !story) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative max-w-4xl w-full bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden">
        <div className="flex flex-col md:flex-row h-full">
          {/* Image */}
          <img
            src={story.image || story.img}
            alt={`${story.brideName} & ${story.groomName}`}
            className="w-full md:w-1/2 h-72 md:h-auto object-cover"
          />

          {/* Scrollable Content */}
          <div className="p-6 md:w-1/2 overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {story.title || `${story.brideName} & ${story.groomName}`}
            </h3>

            <p className="text-sm text-gray-500 mb-4">
              {story.createdAt
                ? new Date(story.createdAt).toLocaleDateString()
                : ""}
            </p>

            {/* FIXED DESCRIPTION */}
            <p className="text-gray-800 leading-relaxed whitespace-pre-line break-words">
              {story.description}
            </p>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="mt-6 px-5 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full hover:scale-105 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SuccessStory = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchStories = async () => {
      try {
        const res = await getPublicSuccessStories();
        if (!mounted) return;

        setStories(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Failed to load stories:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchStories();
    return () => (mounted = false);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-pink-50 via-white to-gray-50">
      <div className="container mx-auto px-6 text-center">
        {/* Header */}
        <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Success Stories
        </h3>

        <p className="text-gray-700 max-w-2xl mx-auto mb-12">
          Real couples. Real stories. Moments that became unforgettable.
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <PlaceholderCard key={i} />
              ))
            : stories.map((story) => (
                <article
                  key={story._id}
                  className="group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/5 backdrop-blur-md border border-white/10"
                >
                  <div className="relative h-64 w-full overflow-hidden">
                    {/* Image */}
                    <img
                      src={story.image || story.img}
                      alt={`${story.brideName} & ${story.groomName}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Content */}
                    <div
                      className="absolute inset-0 flex flex-col justify-end p-4 text-left 
  opacity-0 translate-y-6 
  group-hover:opacity-100 group-hover:translate-y-0 
  transition-all duration-500"
                    >
                      <h4 className="text-white font-semibold text-lg">
                        {story.brideName} & {story.groomName}
                      </h4>

                      <p className="text-gray-200 text-sm mt-1">
                        {story.description?.length > 30
                          ? story.description.substring(0, 30) + "..."
                          : story.description}
                      </p>

                      <button
                        onClick={() => setSelected(story)}
                        className="mt-3 px-4 py-1.5 text-xs bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full hover:scale-105 transition"
                      >
                        View Story →
                      </button>
                    </div>
                  </div>
                </article>
              ))}
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        story={selected}
      />
    </section>
  );
};

export default SuccessStory;
