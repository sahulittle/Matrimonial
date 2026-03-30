import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";

// ✅ Stripe
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// ✅ Your Stripe public key
const stripePromise = loadStripe("pk_test_51T3ziuDRlGfZgIE2KKbE3aqxATyLojEPhTgi1WM3an1uUGZCqbg2IItgCbn7Cx80l3ec0918HedFPpC3aAnLTS1Y00ooB3So99");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Elements stripe={stripePromise}>
          <App />
        </Elements>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
