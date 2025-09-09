export const IsCan = code => {
  const user = JSON.parse(localStorage.getItem("App-User"))

  if (!user || !user.role) return false

  // Define permissions based on roles
  const rolePermissions = {
    ADMIN: [
      "GET_SUBJECT",
      "POST_SUBJECT",
      "PUT_SUBJECT",
      "DELETE_SUBJECT",
      "GET_CLASS",
      "POST_CLASS",
      "PUT_CLASS",
      "DELETE_CLASS",
      "GET_USER",
      "POST_USER",
      "PUT_USER",
      "DELETE_USER",
      "GET_SETTINGS",
      "PUT_SETTINGS",
      "GET_ROLES",
      "POST_ROLES",
      "PUT_ROLES",
      "DELETE_ROLES",
      "GET_PERMISSIONS",
      "POST_PERMISSIONS",
      "PUT_PERMISSIONS",
      "DELETE_PERMISSIONS",
      "GET_DASHBOARD_ADMIN",
      "GET_COURSE",
      "POST_COURSE",
      "PUT_COURSE",
      "DELETE_COURSE",
      "GET_GRADE",
      "POST_GRADE",
      "PUT_GRADE",
      "DELETE_GRADE",
      "GET_ATTENDANCE",
      "POST_ATTENDANCE",
      "PUT_ATTENDANCE",
      "DELETE_ATTENDANCE",
    ],
    TEACHER: [
      "GET_SUBJECT",
      "GET_CLASS",
      "GET_DASHBOARD_TEACHER",
      "GET_COURSE",
      "POST_COURSE",
      "PUT_COURSE",
      "GET_GRADE",
      "POST_GRADE",
      "PUT_GRADE",
      "GET_ATTENDANCE",
      "POST_ATTENDANCE",
      "PUT_ATTENDANCE",
      "GET_PROFILE",
      "PUT_PROFILE",
    ],
    STUDENT: [
      "GET_DASHBOARD_STUDENT",
      "GET_COURSE", // Read-only access
      "GET_GRADE", // Read-only access
      "GET_ATTENDANCE", // Read-only access
      "GET_PROFILE",
      "PUT_PROFILE",
    ],
  }

  // Check if the user's role has the permission for the given code
  return rolePermissions[user.role]?.includes(code) || false
}

// Helper function to check user role
export const hasRole = role => {
  const user = JSON.parse(localStorage.getItem("App-User"))
  
  return user && user.role === role
}

// Helper function to check if user is admin
export const isAdmin = () => {
  return hasRole("ADMIN")
}

// Helper function to check if user is teacher
export const isTeacher = () => {
  return hasRole("TEACHER")
}

// Helper function to check if user is student
export const isStudent = () => {
  return hasRole("STUDENT")
}

// Helper function to get current user role
export const getCurrentUserRole = () => {
  const user = JSON.parse(localStorage.getItem("App-User"))
  
  return user?.role || null
}
