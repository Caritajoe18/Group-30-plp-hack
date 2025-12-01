
export interface AdminStatus {
  exists: boolean;
  isProperlySetup: boolean;
  isAdmin: boolean;
  email?: string;
  error?: string;
}

export interface AdminSetupResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

// Your backend URL
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
/**
 * Fetch helper
 */
async function api(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }

  return res.json();
}

/**
 * Check admin existence using REST API
 */
export const checkAdminUserStatus = async (): Promise<AdminStatus> => {
  try {
    // 1️⃣ Check for admin profile in database
    const profile = await api("/admin/profile");

    if (!profile || !profile.email) {
      return {
        exists: false,
        isProperlySetup: false,
        isAdmin: false,
        error: "No admin user found",
      };
    }

    // 2️⃣ Check if admin auth account exists
    const auth = await api(`/auth/user/${profile.id}`);

    if (!auth || !auth.active) {
      return {
        exists: true,
        isProperlySetup: false,
        isAdmin: false,
        email: profile.email,
        error: "Admin auth record not found",
      };
    }

    return {
      exists: true,
      isProperlySetup: true,
      isAdmin: true,
      email: profile.email,
    };
  } catch (error: any) {
    console.error("Error checking admin status:", error);
    return {
      exists: false,
      isProperlySetup: false,
      isAdmin: false,
      error: error.message,
    };
  }
};

/**
 * Create admin user using REST API
 */
export const createAdminUser = async (
  email: string,
  password: string
): Promise<AdminSetupResult> => {
  try {
    // Prevent duplicate setup
    const status = await checkAdminUserStatus();
    if (status.isProperlySetup) {
      return {
        success: false,
        message: "An admin user already exists",
        data: status,
      };
    }

    // 1️⃣ Create auth user
    const auth = await api("/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        full_name: "Admin User",
        is_admin: true,
      }),
    });

    const userId = auth.userId;

    // 2️⃣ Create profile
    await api("/admin/create-profile", {
      method: "POST",
      body: JSON.stringify({
        id: userId,
        email,
        full_name: "Admin User",
        is_admin: true,
      }),
    });

    return {
      success: true,
      message: "Admin user created successfully",
      data: { userId, email },
    };
  } catch (error: any) {
    console.error("Error creating admin user:", error);
    return {
      success: false,
      message: "Failed to create admin user",
      error: error.message,
    };
  }
};

/**
 * Set up admin AND sign them in using REST API
 */
export const setupAndSignInAdmin = async (
  email: string,
  password: string
): Promise<AdminSetupResult> => {
  try {
    // Ensure admin exists
    const status = await checkAdminUserStatus();

    if (!status.isProperlySetup) {
      const createResult = await createAdminUser(email, password);
      if (!createResult.success) return createResult;
    }

    // Sign in admin
    const login = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    return {
      success: true,
      message: "Admin setup and sign-in successful",
      data: login,
    };
  } catch (error: any) {
    console.error("Error in setupAndSignInAdmin:", error);
    return {
      success: false,
      message: "Admin setup and sign-in failed",
      error: error.message,
    };
  }
};
