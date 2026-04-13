import React from "react";

const ImageUploader = ({ images = [], previews = [], onChange, maxFiles = 10, maxSizeMB = 5 }) => {
  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList || []);
    const total = (images || []).length + newFiles.length;
    if (total > maxFiles) {
      return window.toast?.error ? window.toast.error(`Max ${maxFiles} images allowed`) : alert(`Max ${maxFiles} images allowed`);
    }

    const filtered = [];
    for (const f of newFiles) {
      if (!f.type.startsWith("image/")) {
        window.toast?.error ? window.toast.error("Only image files allowed") : alert("Only image files allowed");
        continue;
      }
      if (f.size > maxSizeMB * 1024 * 1024) {
        window.toast?.error ? window.toast.error(`Each image must be < ${maxSizeMB}MB`) : alert(`Each image must be < ${maxSizeMB}MB`);
        continue;
      }
      filtered.push(f);
    }

    const combined = [...(images || []), ...filtered];
    const newPreviews = combined.map((f) => (typeof f === "string" ? f : URL.createObjectURL(f)));

    onChange && onChange(combined, newPreviews);
  };

  const handleRemove = (index) => {
    const nextFiles = (images || []).slice();
    const nextPreviews = (previews || []).slice();

    // revoke object url if it's a blob URL we created
    const p = nextPreviews[index];
    if (p && p.startsWith("blob:")) URL.revokeObjectURL(p);

    nextFiles.splice(index, 1);
    nextPreviews.splice(index, 1);
    onChange && onChange(nextFiles, nextPreviews);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Upload Images</label>
      <div className="mt-2 flex items-center gap-4">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
          className="text-sm"
        />
        <div className="flex items-center gap-2">
          {(previews || []).map((src, i) => (
            <div key={i} className="relative">
              <img src={src} alt={`img-${i}`} className="h-16 w-16 rounded object-cover border" />
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="absolute -top-2 -right-2 bg-white rounded-full p-1 text-xs shadow"
                aria-label="Remove image"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-1">Max {maxFiles} images, each &lt; {maxSizeMB}MB.</p>
    </div>
  );
};

export default ImageUploader;
