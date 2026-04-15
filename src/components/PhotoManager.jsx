import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import * as photoService from "../api/userApi/userApi";

export default function PhotoManager() {
  const [photos, setPhotos] = useState([]);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [page, setPage] = useState(1);
  const [showAllModal, setShowAllModal] = useState(false);
  const maxFiles = 8;

  const fetch = async () => {
    try {
      const data = await photoService.getPhotos();
      setPhotos(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const allowed = acceptedFiles.filter((f) => f.size <= 5 * 1024 * 1024);
      setFiles((s) =>
        [...s, ...allowed].slice(0, maxFiles - photos.length + s.length),
      );
    },
    [photos.length],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
  });

  const handleUpload = async () => {
    if (!files.length) return;

    setUploading(true);

    try {
      const data = await photoService.uploadPhotos(files, (evt) => {
        const pct = Math.round((evt.loaded * 100) / evt.total);
        setProgress(pct);
      });

      setPhotos(data.photos || []);
      setFiles([]);
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleSetProfile = async (id) => {
    await photoService.setProfilePhoto(id);
    fetch();
  };

  const handlePrivacy = async (id, privacy) => {
    await photoService.updatePhotoPrivacy(id, privacy);
    fetch();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this photo?")) return;
    await photoService.deletePhoto(id);
    fetch();
  };

  const move = async (id, dir) => {
    const idx = photos.findIndex((p) => p._id === id);
    if (idx === -1) return;
    const newIndex = idx + dir;
    if (newIndex < 0 || newIndex >= photos.length) return;
    const arr = [...photos];
    const [item] = arr.splice(idx, 1);
    arr.splice(newIndex, 0, item);
    setPhotos(arr);
    try {
      await photoService.reorderPhotos(arr.map((p) => p._id));
    } catch (e) {
      console.error(e);
    }
  };
  const photosPerPage = 3;

  const totalPages = Math.ceil(photos.length / photosPerPage);

  const paginatedPhotos = photos.slice(
    (page - 1) * photosPerPage,
    page * photosPerPage,
  );
  return (
    <div className="p-4">
      <div
        {...getRootProps()}
        className="border-2 border-dashed p-4 rounded-md text-center cursor-pointer"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop images here...</p>
        ) : (
          <p>Drag & drop images, or click to select (max {maxFiles})</p>
        )}
      </div>

      {files.length > 0 && (
        <div className="mt-3">
          <div className="flex gap-2 flex-wrap">
            {files.map((f, i) => (
              <div
                key={i}
                className="w-24 h-24 bg-gray-100 rounded overflow-hidden flex items-center justify-center"
              >
                <img
                  src={URL.createObjectURL(f)}
                  alt={f.name}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
          <div className="mt-2">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {uploading ? `Uploading ${progress}%` : "Upload"}
            </button>
          </div>
        </div>
      )}

      <h3 className="mt-4 font-semibold">Your Photos</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
        {paginatedPhotos.map((p) => (
          <div
            key={p._id}
            className={`relative rounded-lg overflow-hidden border bg-white ${
              p.isProfile ? "ring-2 ring-indigo-500" : ""
            }`}
          >
            {/* Image */}
            <img src={p.url} alt="photo" className="w-full h-28 object-cover" />

            {/* Profile Badge */}
            {p.isProfile && (
              <span className="absolute top-1 left-1 bg-indigo-600 text-white text-[10px] px-1 rounded">
                Profile
              </span>
            )}

            {/* Actions */}
            <div className="p-1 space-y-1">
              {/* Set Profile */}
              <button
                onClick={() => handleSetProfile(p._id)}
                disabled={p.isProfile}
                className="w-full text-[10px] bg-green-500 text-white py-1 rounded"
              >
                {p.isProfile ? "Profile" : "Set Profile"}
              </button>

              {/* Privacy */}
              <select
                value={p.privacy}
                onChange={(e) => handlePrivacy(p._id, e.target.value)}
                className="w-full text-[10px] border rounded px-1 py-1"
              >
                <option value="public">Public</option>
                <option value="protected">Protected</option>
                <option value="private">Private</option>
              </select>

              {/* Delete */}
              <button
                onClick={() => handleDelete(p._id)}
                className="w-full text-[10px] bg-red-500 text-white py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {photos.length > 0 && (
        <div className="mt-3 text-center">
          <button
            onClick={() => setShowAllModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            View All Photos
          </button>
        </div>
      )}
      {totalPages >= 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1 ? "bg-indigo-600 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {showAllModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-[95%] max-w-4xl max-h-[85vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">All Photos</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {photos.map((p) => (
                <div
                  key={p._id}
                  className={`relative rounded-lg overflow-hidden border bg-white ${
                    p.isProfile ? "ring-2 ring-indigo-500" : ""
                  }`}
                >
                  {/* Image */}
                  <img src={p.url} className="w-full h-32 object-cover" />

                  {/* Profile Badge */}
                  {p.isProfile && (
                    <span className="absolute top-1 left-1 bg-indigo-600 text-white text-[10px] px-1 rounded">
                      Profile
                    </span>
                  )}

                  {/* Actions */}
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => handleSetProfile(p._id)}
                      className="w-full text-xs bg-green-500 text-white py-1 rounded"
                    >
                      Set Profile
                    </button>

                    <select
                      value={p.privacy}
                      onChange={(e) => handlePrivacy(p._id, e.target.value)}
                      className="w-full text-xs border rounded px-1 py-1"
                    >
                      <option value="public">Public</option>
                      <option value="protected">Protected</option>
                      <option value="private">Private</option>
                    </select>

                    <button
                      onClick={() => handleDelete(p._id)}
                      className="w-full text-xs bg-red-500 text-white py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowAllModal(false)}
              className="mt-4 w-full bg-gray-300 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
