import React from "react";

const SignUp: React.FC = () => {
  return (
    <div className="p-4 max-w-md mx-auto mt-20 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Sign Up</h2>
      <p className="mb-2">Registration is disabled. Use default credentials:</p>
      <p className="mb-1"><b>Username:</b> admin</p>
      <p><b>Password:</b> admin123</p>
    </div>
  );
};

export default SignUp;
