import React from "react";
import { Link } from "react-router-dom";
import AboutStats from "../../../components/public/AboutStats";
import aboutData from "../../../data/aboutData";
import Footer from "../home/Footer";

const About = () => {
  const stats = [
    { label: "Successful Matches", value: "+1200" },
    { label: "Trusted Families", value: "+500" },
    { label: "Local Chapters", value: "+15" },
  ];

  return (
    <div className="bg-white">
      {/* Hero: full bleed with overlay */}
      <header
        className="w-full bg-cover bg-center min-h-[300px] md:min-h-[400px] flex items-center justify-center"
        style={{ backgroundImage: `url(${aboutData.heroImage})` }}
      >
        <div className="w-full h-full bg-black/40 flex items-center justify-center px-6">
          <div className="max-w-4xl text-center text-white">
            <h1 className="text-3xl md:text-5xl font-bold">
              {aboutData.title}
            </h1>

            <p className="mt-3 max-w-2xl mx-auto text-base md:text-lg opacity-90">
              Marathishubhavivah.com bridges tradition and modern matchmaking —
              a secure, community-focused platform helping Marathi families find
              meaningful lifelong partners with trust and cultural values.
            </p>
          </div>
        </div>
      </header>

      {/* Content: two-column with image + text */}
      <main className="max-w-6xl mx-auto px-6 lg:px-0 -mt-10">
        <div className="grid grid-cols-1 gap-8 place-items-center">
          <div className="w-full max-w-3xl">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {aboutData.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-gray-700 leading-relaxed mb-4 text-justify"
                  dangerouslySetInnerHTML={{
                    __html: p.replace(/\n/g, "<br/>"),
                  }}
                />
              ))}

              <div className="mt-6 flex justify-end">
                <Link
                  to="/contact"
                  className="inline-block px-6 py-2 bg-pink-500 text-white rounded-full shadow hover:bg-pink-600"
                >
                  {aboutData.cta.text}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Stats */}
      <section className="mt-12">
        <AboutStats stats={stats} />
      </section>

      <Footer />
    </div>
  );
};

export default About;
