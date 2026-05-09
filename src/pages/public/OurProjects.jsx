import React from "react";
import Footer from "../public/home/Footer";
import { ExternalLink, Target, Calendar, Award, Heart, Briefcase, GraduationCap, Users } from "lucide-react";

const projects = [
  { id: 1, img: "/project-1.jpeg", title: "Project Overview 1" },
  { id: 2, img: "/project-2.jpeg", title: "Project Overview 2" },
  { id: 3, img: "/project-3.jpeg", title: "Project Overview 3" },
  { id: 4, img: "/project-4.jpeg", title: "Project Overview 4" },
  { id: 5, img: "/project-5.jpeg", title: "Project Overview 5" },
  { id: 6, img: "/project-6.jpeg", title: "Project Overview 6" },
  { id: 7, img: "/project-7.jpeg", title: "Project Overview 7" },
  { id: 8, img: "/project-8.jpeg", title: "Project Overview 8" },
  { id: 9, img: "/project-9.jpeg", title: "Project Overview 9" },
  { id: 10, img: "/project-10.jpeg", title: "Project Overview 10" },
  { id: 11, img: "/project-11.jpeg", title: "Project Overview 11" },
  { id: 12, img: "/project-12.jpeg", title: "Project Overview 12" },
];

export default function OurProjects() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-pink-600 to-rose-700 text-white overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-white">
            आमची प्रकल्पे <span className="text-pink-200">—</span> Our Projects
          </h1>
          <p className="text-xl md:text-2xl font-medium max-w-3xl mx-auto text-pink-50">
            विदर्भ वैभव मंदिर, मुंबई — विदर्भ समाज संघ, मुंबई
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <span className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold border border-white/30">
              <Calendar className="w-4 h-4" /> स्थापना: १९७९
            </span>
            <span className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold border border-white/30">
              <Award className="w-4 h-4" /> नोंदणी क्र. : ४६३८
            </span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-pink-600">४५+</p>
            <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold">वर्षे अनुभव</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-pink-600">१०००+</p>
            <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold">लाभार्थी</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-pink-600">५०+</p>
            <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold">सांस्कृतिक कार्यक्रम</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-pink-600">१००%</p>
            <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold">सामाजिक बांधिलकी</p>
          </div>
        </div>
      </section> */}

      {/* Main Content */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            
            {/* Project Details */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-pink-50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Target className="text-pink-600" /> संस्थेचे उपक्रम
                </h2>
                <ul className="space-y-4">
                  {[
                    { icon: <Users />, text: "मुंबईत उपचारासाठी व कामा निम्मित्त येणाऱ्या विदर्भातील जनतेसाठी दादर येथील इमारतीमध्ये नाममात्र शुल्कात राहण्याची व्यवस्था." },
                    { icon: <Heart />, text: "विदर्भ व मुंबई येथील कॅन्सर हॉस्पिटलमध्ये उपचार घेणाऱ्या विदर्भातील रुग्णांना आर्थिक मदत देणे." },
                    { icon: <GraduationCap />, text: "विदर्भातील गुणवत्ता प्रदान, गरीब व होतकरू विद्यार्थांना शिष्यवृत्ती देणे." },
                    { icon: <Users />, text: "संत, थोर राष्ट्रपुरुष यांची जयंती व पुण्यतिथी साजरी करणे." },
                    { icon: <Heart />, text: "महिलांचे एकत्रीकरण व सक्षमीकरण करून सामाजिक, सांस्कृतिक उपक्रम राबविणे." },
                    { icon: <Briefcase />, text: "तरुणांच्या नोकरी व विकासाकरिता विविध उपक्रम राबविणे." },
                    { icon: <GraduationCap />, text: "विद्यार्थांना शैक्षणिक मदत." },
                    { icon: <Award />, text: "UPSC/MPSC/COMBINE SSC-CGL अधिकारी पूर्वपरीक्षा तयारी वर्ग चालविणे." }
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="mt-1 w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600 shrink-0">
                        {React.cloneElement(item.icon, { size: 16 })}
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{item.text}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-pink-600 to-pink-700 p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                <h3 className="text-xl font-bold mb-4">आमच्या प्रकल्पांचा उद्देश</h3>
                <p className="text-pink-100 leading-relaxed mb-6">
                  समाजाच्या आरोग्य, शिक्षण आणि आर्थिक सक्षमीकरणावर लक्ष केंद्रित करणे और विदर्भीत समाजाला मुंबईमध्ये आधार देणे.
                </p>
                <div className="flex gap-4">
                  <a href="/contact" className="px-6 py-2 bg-white text-pink-600 rounded-full font-bold text-sm hover:bg-pink-50 transition-colors">
                    संपर्क साधा
                  </a>
                </div>
              </div>
            </div>

            {/* Photo Gallery */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 tracking-tight">प्रकल्प छायाचित्रे</h2>
                  <p className="text-gray-500 mt-2">आमच्या कार्याची काही क्षणचित्रे</p>
                </div>
                <div className="hidden sm:block">
                  <div className="h-1 w-20 bg-pink-600 rounded-full"></div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div 
                    key={project.id} 
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 aspect-[4/3]"
                  >
                    <img 
                      src={project.img} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                      <p className="text-white font-bold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        {project.title}
                      </p>
                      <button className="mt-4 w-10 h-10 rounded-full bg-pink-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 translate-y-4 group-hover:translate-y-0">
                        <ExternalLink size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-50 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(219,39,119,0.05)_0%,rgba(255,255,255,0)_70%)] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">विदर्भ वैभव मंदिर परिवारात सामील व्हा</h2>
          <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
            आम्ही समाजाच्या कल्याणासाठी कार्यरत आहोत. आमच्या उपक्रमांमध्ये सहभागी होऊन समाजसेवेचा आनंद घ्या.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/register" 
              className="px-10 py-4 bg-pink-600 text-white rounded-full font-bold shadow-lg shadow-pink-200 hover:bg-pink-700 hover:scale-105 transition-all"
            >
              नोंदणी करा
            </a>
            <a 
              href="/contact" 
              className="px-10 py-4 bg-white text-gray-800 border border-gray-200 rounded-full font-bold hover:bg-gray-50 hover:scale-105 transition-all"
            >
              आमच्याबद्दल अधिक जाणून घ्या
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
