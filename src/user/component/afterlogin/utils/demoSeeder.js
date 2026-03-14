// Demo Data Seeder - Creates and seeds demo data into localStorage
// SINGLE source of truth for demo data

const DEMO_USER_EMAIL = "demo@client.com";
const DEMO_USER_PASSWORD = "123456";

let cachedProfiles = null;

export function initializeDemoData() {

  const requiredCollections = [
    "users",
    "profiles",
    "interests",
    "messages",
    "notifications",
    "visitors",
    "shortlist",
    "conversations"
  ];

  const demoInitialized = localStorage.getItem("demoInitialized");

  if (demoInitialized) {
    const valid = requiredCollections.every(key => localStorage.getItem(key));

    if (valid) {
      console.log("Demo data already initialized");
      return;
    }
  }

  console.log("Initializing demo data...");

  seedUsers();
  seedProfiles();
  seedInterests();
  seedMessages();
  seedConversations();
  seedNotifications();
  seedVisitors();
  seedShortlist();

  localStorage.setItem("demoInitialized", "true");

  console.log("Demo data initialized successfully");
}

function generateDemoProfiles() {

  if (cachedProfiles) return cachedProfiles;

  const femaleNames = [
    "Priya Sharma","Anjali Patel","Neha Singh","Riya Gupta","Sneha Verma",
    "Pooja Reddy","Divya Kumar","Kavya Nair","Meera Joshi","Aisha Shah",
    "Shreya Mishra","Khushi Jain","Radhika Bhatia","Aarti Desai","Palak Chandra"
  ];

  const maleNames = [
    "Rahul Sharma","Amit Patel","Karan Singh","Arjun Mehta","Rohit Verma",
    "Vikram Reddy","Aditya Gupta","Sanjay Kumar","Varun Nair","Nikhil Joshi",
    "Deepak Shah","Saurabh Mishra","Prateek Jain","Raj Malhotra","Kunal Singh"
  ];

  const cities = ["Delhi","Mumbai","Ahmedabad","Bangalore","Chennai","Kolkata"];

  const professions = [
    "Software Engineer","Doctor","Teacher","Architect",
    "Business Owner","Professor","Designer","Data Scientist"
  ];

  const profiles = [];

  for (let i = 0; i < 15; i++) {
    profiles.push({
      id: String(i + 2),
      name: femaleNames[i],
      age: 22 + Math.floor(Math.random() * 8),
      gender: "Female",
      profession: professions[Math.floor(Math.random() * professions.length)],
      religion: "Hindu",
      location: {
        city: cities[Math.floor(Math.random() * cities.length)]
      },
      avatar: `https://randomuser.me/api/portraits/women/${20 + i}.jpg`
    });
  }

  for (let i = 0; i < 15; i++) {
    profiles.push({
      id: String(i + 17),
      name: maleNames[i],
      age: 25 + Math.floor(Math.random() * 10),
      gender: "Male",
      profession: professions[Math.floor(Math.random() * professions.length)],
      religion: "Hindu",
      location: {
        city: cities[Math.floor(Math.random() * cities.length)]
      },
      avatar: `https://randomuser.me/api/portraits/men/${20 + i}.jpg`
    });
  }

  cachedProfiles = profiles;

  return profiles;
}

function seedUsers() {

  const profiles = generateDemoProfiles();

  const users = profiles.map(p => ({
    id: p.id,
    name: p.name,
    email: p.name.toLowerCase().replace(" ", "") + "@demo.com",
    password: "123456"
  }));

  users.unshift({
    id: "1",
    name: "Demo Client",
    email: DEMO_USER_EMAIL,
    password: DEMO_USER_PASSWORD,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  });

  localStorage.setItem("users", JSON.stringify(users));
}

function seedProfiles() {

  const profiles = generateDemoProfiles();
  const profileMap = {};

  profileMap["1"] = {
    id: "1",
    name: "Demo Client",
    age: 28,
    gender: "Male",
    profession: "Software Engineer",
    religion: "Hindu",
    location: { city: "Mumbai" },
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  };

  profiles.forEach(p => profileMap[p.id] = p);

  localStorage.setItem("profiles", JSON.stringify(profileMap));
}

function seedInterests() {

  const interests = {
    "1": {
      sent: [
        { id: "i1", senderId: "1", receiverId: "4", status: "pending" }
      ],
      received: [
        { id: "i2", senderId: "2", receiverId: "1", status: "pending" },
        { id: "i3", senderId: "3", receiverId: "1", status: "accepted" }
      ]
    }
  };

  localStorage.setItem("interests", JSON.stringify(interests));
}

function seedMessages() {

  const messages = [
    {
      id: "msg1",
      senderId: "3",
      receiverId: "1",
      message: "Hi! Nice to connect with you.",
      timestamp: new Date().toISOString(),
      read: false
    }
  ];

  localStorage.setItem("messages", JSON.stringify(messages));
}

function seedConversations() {

  const conversations = [
    {
      id: "conv1",
      users: ["1","3"],
      lastMessage: "Hi! Nice to connect with you.",
      updatedAt: new Date().toISOString()
    }
  ];

  localStorage.setItem("conversations", JSON.stringify(conversations));
}

function seedNotifications() {

  const notifications = {
    "1": [
      {
        id: "n1",
        type: "interest",
        message: "Priya Sharma showed interest in your profile",
        read: false
      },
      {
        id: "n2",
        type: "message",
        message: "Neha Singh sent you a message",
        read: false
      }
    ]
  };

  localStorage.setItem("notifications", JSON.stringify(notifications));
}

function seedVisitors() {

  const visitors = {
    "1": [
      { id: "2", name: "Priya Sharma" },
      { id: "3", name: "Neha Singh" },
      { id: "5", name: "Sneha Verma" }
    ]
  };

  localStorage.setItem("visitors", JSON.stringify(visitors));
}

function seedShortlist() {
  localStorage.setItem("shortlist", JSON.stringify([]));
}

export function resetAndInitializeDemo() {

  localStorage.clear();

  initializeDemoData();
}