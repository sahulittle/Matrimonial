import React from "react";

const AboutContent = ({ paragraphs }) => {
  return (
    <div className="px-6 lg:px-10 py-6">
      <div className="max-w-3xl mx-auto text-gray-700 leading-relaxed space-y-4 text-justify">
        {paragraphs.map((p, idx) => (
          <p
            key={idx}
            dangerouslySetInnerHTML={{ __html: p.replace(/\n/g, "<br/>") }}
          />
        ))}
      </div>
    </div>
  );
};

export default AboutContent;
