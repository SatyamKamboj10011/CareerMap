// Auth.js  - JWT authentication service
//handles all the token realted operations for frontend

//save JWT token to localStorage after successful login

export const saveToken = (token) => {
    localStorage.setItem('careermap_token', token);
};

//Get JWT token from localStorage
export const getToken = () => {
    return localStorage.getItem('careermap_token');
};

//Remove JWT token from localStorage (logout)
export const removeToken = () => {
    localStorage.removeItem('careermap_token');
};

// Check if user is currently logged in
export const isAuthenticated = () => {
  return getToken() !== null;
};

// Save user details to localStorage
export const saveUser = (user) => {
  localStorage.setItem('careermap_user', JSON.stringify(user));
};

// Get user details from localStorage
export const getUser = () => {
  const user = localStorage.getItem('careermap_user');
  return user ? JSON.parse(user) : null;
};

// Remove user details from localStorage (logout)
export const removeUser = () => {
  localStorage.removeItem('careermap_user');
};

// Full logout - remove both token and user
export const logout = () => {
  removeToken();
  removeUser();
};
