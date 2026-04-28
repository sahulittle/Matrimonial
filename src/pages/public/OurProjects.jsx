import React from "react";
import Footer from "../public/home/Footer";
export default function OurProjects() {
  return (
    <>
      {" "}
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
          <h1 className="text-3xl font-bold text-pink-600 mb-4">
            आमची प्रकल्पे — Our Projects
          </h1>

          <p className="text-gray-700 mb-6">
            <strong>विदर्भ वैभव मंदिर, मुंबई — विदर्भ समाज संघ, मुंबई</strong>
          </p>

          <div className="grid gap-4">
            <div className="p-4 border rounded-lg bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">स्थापना</h2>
              <p className="text-gray-700">१९७९</p>
              <p className="text-sm text-gray-500 mt-1">
                धर्मादाय आयुक्त नोंदणी क्र. : ४६३८
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                संस्थेचे उपक्रम
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>
                  मुंबईत उपचारासाठी व कामा निम्मित्त येणाऱ्या विदर्भातील
                  जनतेसाठी दादर येथील इमारतीमध्ये नाममात्र शुल्कात राहण्याची
                  व्यवस्था.
                </li>
                <li>
                  विदर्भ व मुंबई येथील कॅन्सर हॉस्पिटलमध्ये उपचार घेणाऱ्या
                  विदर्भातील रुग्णांना आर्थिक मदत देणे.
                </li>
                <li>
                  विदर्भातील गुणवत्ता प्रदान, गरीब व होतकरू विद्यार्थांना
                  शिष्यवृत्ती देणे.
                </li>
                <li>
                  संत, थोर राष्ट्रपुरुष यांची जयंती व पुण्यतिथी साजरी करणे.
                </li>
                <li>
                  महिलांचे एकत्रीकरण व सक्षमीकरण करून सामाजिक, सांस्कृतिक उपक्रम
                  राबविणे.
                </li>
                <li>तरुणांच्या नोकरी व विकासाकरिता विविध उपक्रम राबविणे.</li>
                <li>विद्यार्थांना शैक्षणिक मदत.</li>
                <li>
                  UPSC/MPSC/COMBINE SSC-CGL/SSC-CHSL/RAILWAYS/BANKING/IPS
                  (INDIAN POLICE SERVICE) प्रथम वर्ग अधिकारी पूर्वपरीक्षा तयारी
                  वर्ग चालविणे.
                </li>
              </ol>
            </div>

            <div className="p-4 border rounded-lg bg-gradient-to-r from-pink-50 to-white">
              <h3 className="text-lg font-semibold text-gray-800">
                आमच्या प्रकल्पांचा उद्देश
              </h3>
              <p className="text-gray-700">
                समाजाच्या आरोग्य, शिक्षण आणि आर्थिक सक्षमीकरणावर लक्ष केंद्रित
                करणे आणि विदर्भीत समाजाला मुंबईमध्ये आधार देणे.
              </p>
            </div>

            <div className="flex gap-3 mt-4">
              <a
                href="/contact"
                className="px-4 py-2 bg-pink-600 text-white rounded shadow"
              >
                आमच्याशी संपर्क साधा
              </a>
              <a href="/" className="px-4 py-2 border rounded">
                मुख्यपृष्ठावर जा
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
