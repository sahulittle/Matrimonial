export const getAvatarFallback = (gender) => {
  return gender?.toLowerCase() === 'female' ? '/default-female.png' : '/default-male.png';
};
