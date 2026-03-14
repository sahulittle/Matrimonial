/* ---------- USERS ---------- */

export function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || []
}

export function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users))
}

export function addUser(user) {
  const users = getUsers()
  users.push(user)
  saveUsers(users)
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"))
}

export function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user))
}

export function logoutUser() {
  localStorage.removeItem("currentUser")
}

export function clearCurrentUser() {
  localStorage.removeItem("currentUser")
}

/* ---------- PROFILES ---------- */

export function getProfiles() {
  return JSON.parse(localStorage.getItem("profiles")) || {}
}

export function getUserProfile(userId) {
  const profiles = getProfiles()
  return profiles[userId]
}

export function saveUserProfile(userId, profile) {
  const profiles = getProfiles()
  profiles[userId] = profile
  localStorage.setItem("profiles", JSON.stringify(profiles))
}

/* ---------- DEFAULT PROFILE ---------- */

export function createDefaultProfile(user) {
  const profile = {
    id: user.id,
    name: user.name,
    age: "",
    height: "",
    religion: "",
    motherTongue: "",
    location: {
      country: "India",
      state: "",
      city: ""
    },
    aboutMe: "",
    avatar: user.avatar || "/default-avatar.png"
  }

  saveUserProfile(user.id, profile)

  return profile
}

/* ---------- INTERESTS ---------- */

export function getInterests() {
  try {
    const data = localStorage.getItem('interests')
    if (data) return JSON.parse(data)
  } catch {}
  return {}
}

export function getInterestsForUser(userId) {
  const interests = getInterests()
  return interests[userId] || { sent: [], received: [] }
}

export function sendInterest(interest) {
  const { senderId, receiverId, profile } = interest;
  const allInterests = getInterests();
  const allProfiles = getProfiles();

  // Add to sender's 'sent' list
  if (!allInterests[senderId]) allInterests[senderId] = { sent: [], received: [] };
  
  // Avoid duplicate interests
  if (allInterests[senderId].sent.some(i => String(i.receiverId) === String(receiverId))) {
    return; // Already sent
  }

  const newInterestId = Date.now();

  const newSentInterest = {
    id: newInterestId,
    receiverId,
    profile, // The profile of the person they are sending to
    status: 'pending',
    timestamp: new Date().toISOString(),
  };
  allInterests[senderId].sent.push(newSentInterest);

  // Add to receiver's 'received' list
  if (!allInterests[receiverId]) allInterests[receiverId] = { sent: [], received: [] };
  const senderProfile = allProfiles[senderId];
  const newReceivedInterest = {
    id: newInterestId, // same id
    senderId,
    profile: senderProfile, // The profile of the person who sent it
    status: 'pending',
    timestamp: new Date().toISOString(),
  };
  allInterests[receiverId].received.push(newReceivedInterest);

  localStorage.setItem("interests", JSON.stringify(allInterests));
}

export function updateInterestStatus(userId, interestId, status) {
  const interests = getInterests()

  if (interests[userId]) {
    interests[userId].received = interests[userId].received.map(i =>
      i.id === interestId ? { ...i, status } : i
    )

    const receivedInterest = interests[userId].received.find(i => i.id === interestId)
    if (receivedInterest && interests[receivedInterest.senderId]) {
      interests[receivedInterest.senderId].sent = interests[receivedInterest.senderId].sent.map(i =>
        i.id === interestId ? { ...i, status } : i
      )
    }

    localStorage.setItem("interests", JSON.stringify(interests))
  }
}

/* ---------- MESSAGES ---------- */

export function getMessages() {
  try {
    const data = localStorage.getItem('messages')
    if (data) return JSON.parse(data)
  } catch {}
  return []
}

export function getConversationsForUser(userId) {
  const conversations = JSON.parse(localStorage.getItem('conversations')) || {};
  return conversations[userId] || [];
}

export function sendMessageToStorage(senderId, receiverId, messageText) {
  const messages = getMessages()
  const newMessage = {
    id: `msg-${Date.now()}`,
    senderId: senderId,
    receiverId: receiverId,
    message: messageText,
    timestamp: new Date().toISOString(),
    read: false
  }
  messages.push(newMessage)
  localStorage.setItem("messages", JSON.stringify(messages))
  return newMessage
}

export function getUserMessages(userId) {
  return getMessages().filter(m => m.senderId === userId || m.receiverId === userId)
}

export function getConversation(userId, otherUserId) {
  return getMessages().filter(
    m => (m.senderId === userId && m.receiverId === otherUserId) ||
         (m.senderId === otherUserId && m.receiverId === userId)
  ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
}

export function getUnreadMessagesCount(userId) {
  return getMessages().filter(m => m.receiverId === userId && !m.read).length
}

export function markMessageAsReadStorage(messageId) {
  const messages = getMessages().map(m =>
    m.id === messageId ? { ...m, read: true } : m
  )
  localStorage.setItem("messages", JSON.stringify(messages))
}

export function markMessagesAsReadByUser(userId, otherUserId) {
  const messages = getMessages().map(m => {
    if ((m.senderId === otherUserId && m.receiverId === userId) && !m.read) {
      return { ...m, read: true }
    }
    return m
  })
  localStorage.setItem("messages", JSON.stringify(messages))
}

/* ---------- NOTIFICATIONS ---------- */

export function getNotifications() {
  try {
    const data = localStorage.getItem('notifications')
    if (data) return JSON.parse(data)
  } catch {}
  return {}
}

export function getUserNotifications(userId) {
  const notifications = getNotifications()
  return notifications[userId] || []
}

export function addNotification(userId, notification) {
  const notifications = getNotifications()

  if (!notifications[userId]) {
    notifications[userId] = []
  }

  notifications[userId].unshift({
    id: `notif-${Date.now()}`,
    ...notification,
    timestamp: new Date().toISOString(),
    read: false
  })

  localStorage.setItem("notifications", JSON.stringify(notifications))
}

export function markNotificationAsReadStorage(userId, notificationId) {
  const notifications = getNotifications()

  if (notifications[userId]) {
    notifications[userId] = notifications[userId].map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    )
    localStorage.setItem("notifications", JSON.stringify(notifications))
  }
}

export function markAllNotificationsAsRead(userId) {
  const notifications = getNotifications()
  if (notifications[userId]) {
    notifications[userId] = notifications[userId].map(n => ({ ...n, read: true }))
    localStorage.setItem("notifications", JSON.stringify(notifications))
  }
}

export function removeNotificationStorage(userId, notificationId) {
  const notifications = getNotifications()
  if (notifications[userId]) {
    notifications[userId] = notifications[userId].filter(n => n.id !== notificationId)
    localStorage.setItem("notifications", JSON.stringify(notifications))
  }
}

/* ---------- VISITORS ---------- */

export function getVisitors() {
  try {
    const data = localStorage.getItem('visitors')
    if (data) return JSON.parse(data)
  } catch {}
  return {}
}

export function getVisitorsForUser(userId) {
  const visitors = getVisitors()
  return visitors[userId] || []
}

export function addVisitor(ownerId, visitorProfile) {
  const visitors = getVisitors()
  
  if (!visitors[ownerId]) {
    visitors[ownerId] = []
  }
  
  // Check if already visited
  const exists = visitors[ownerId].some(v => v.id === visitorProfile.id)
  
  if (!exists) {
    visitors[ownerId].unshift({
      ...visitorProfile,
      viewedAt: new Date().toISOString()
    })
    
    // Keep only last 20 visitors
    if (visitors[ownerId].length > 20) {
      visitors[ownerId] = visitors[ownerId].slice(0, 20)
    }
    
    localStorage.setItem("visitors", JSON.stringify(visitors))
  }
}

/* ---------- SHORTLIST ---------- */

export function getShortlistForUser(userId) {
  const shortlist = JSON.parse(localStorage.getItem('shortlist')) || {};
  return shortlist[userId] || [];
}

export function saveShortlistForUser(userId, shortlist) {
  const allShortlists = JSON.parse(localStorage.getItem('shortlist')) || {};
  allShortlists[userId] = shortlist;
  localStorage.setItem('shortlist', JSON.stringify(allShortlists));
}

export const addToShortlist = (userId, profile) => {
  const shortlist = getShortlistForUser(userId);
  if (!shortlist.some(p => String(p.id) === String(profile.id))) {
    const newShortlist = [...shortlist, profile];
    saveShortlistForUser(userId, newShortlist);
  }
};

export const removeFromShortlist = (userId, profileId) => {
  const shortlist = getShortlistForUser(userId);
  const newShortlist = shortlist.filter(p => String(p.id) !== String(profileId));
  saveShortlistForUser(userId, newShortlist);
};

/* ---------- DASHBOARD USERS ---------- */

export function getVisibleUsers(currentUserId) {
  const users = getUsers()
  return users.filter(user => user.id !== currentUserId)
}

export function getUserById(userId) {
  const users = getUsers()
  return users.find(u => u.id === userId)
}
