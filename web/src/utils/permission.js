export const IsCan = code => {
  const user = JSON.parse(localStorage.getItem("App-User"))
  
  if (!user || !user.role) return false
  
  // Define permissions based on roles
  const rolePermissions = {
    ADMIN: ["GET_SUBJECT", "GET_CLASS", "GET_USER", "GET_SETTINGS"],
    TEACHER: ["GET_SUBJECT", "GET_CLASS"],
    STUDENT: []
  }
  
  // Check if the user's role has the permission for the given code
  return rolePermissions[user.role]?.includes(code) || false
}

// Helper function to check user role
export const hasRole = (role) => {
  const user = JSON.parse(localStorage.getItem("App-User"))
  return user && user.role === role
}
