import axios from "axios";

const API = "http://localhost:5003/api/users";

// get matches
export const getMatches = async () => {
  const res = await axios.get(`${API}/search`, { withCredentials: true });
  return res.data;
};

// sent interests
export const getSentInterests = async () => {
  const res = await axios.get(`${API}/interests/sent`, {
    withCredentials: true,
  });
  return res.data;
};

// received interests
export const getReceivedInterests = async () => {
  const res = await axios.get(`${API}/interests/received`, {
    withCredentials: true,
  });
  return res.data;
};

// send interest
export const sendInterest = async (receiverId) => {
  const res = await axios.post(
    `${API}/interests/send`,
    { receiverId },
    { withCredentials: true },
  );
  return res.data;
};

// toggle shortlist
export const toggleShortlist = async (profileId) => {
  const res = await axios.post(
    `${API}/interests/toggle/${profileId}`,
    {},
    { withCredentials: true },
  );
  return res.data;
};
