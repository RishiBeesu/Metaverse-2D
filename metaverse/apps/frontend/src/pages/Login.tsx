import { InputBox } from "@repo/ui/input-box";
import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    console.log(username);
    console.log(password);
  };

  return (
    <div className="min-h-screen bg-blup flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-600 mt-2">Start your journey with us</p>
          </div>

          {/* Signin Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <InputBox
              htmlFor="username"
              label="Username"
              id="username"
              name="username"
              value={username}
              placeholder="Choose a username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            {/* Password Input */}
            <InputBox
              type="password"
              htmlFor="password"
              label="Password"
              id="password"
              name="password"
              value={password}
              placeholder="Create a strong password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>

            {/* Login Link */}
            <div className="text-center mt-4 text-sm text-gray-600">
              Already have an account?
              <a href="/signup" className="text-blue-600 hover:underline ml-1">
                Sign Up
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
