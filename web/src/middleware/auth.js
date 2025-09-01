import { getCurrentUserRole, IsCan } from "@/utils/permission";

// Route protection middleware
export const requireAuth = (to, from, next) => {
  const user = JSON.parse(localStorage.getItem("App-User"));
  const token = localStorage.getItem("App-Token");

  if (!user || !token) {
    next("/login");
    return;
  }

  next();
};

// Admin-only routes
export const requireAdmin = (to, from, next) => {
  const userRole = getCurrentUserRole();

  if (userRole !== "ADMIN") {
    // Redirect to home with error message
    next("/");
    return;
  }

  next();
};

// Teacher or Admin routes
export const requireTeacherOrAdmin = (to, from, next) => {
  const userRole = getCurrentUserRole();

  if (userRole !== "TEACHER" && userRole !== "ADMIN") {
    next("/");
    return;
  }

  next();
};

// Permission-based middleware
export const requirePermission = (permission) => {
  return (to, from, next) => {
    if (!IsCan(permission)) {
      next("/");
      return;
    }

    next();
  };
};

// Role-specific dashboard redirect
export const redirectToDashboard = (to, from, next) => {
  const userRole = getCurrentUserRole();

  // If user is on login page and already authenticated, redirect to appropriate dashboard
  if (to.path === "/login") {
    const user = JSON.parse(localStorage.getItem("App-User"));
    const token = localStorage.getItem("App-Token");

    if (user && token) {
      next("/");
      return;
    }
  }

  next();
};
