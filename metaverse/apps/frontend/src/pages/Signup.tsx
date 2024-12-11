import { InputBox } from "@repo/ui/input-box";
import { useState } from "react";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = () => {
    console.log(username);
    console.log(email);
    console.log(password);
    console.log(confirmPassword);
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

          {/* Signup Form */}
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
            {/* Email Input */}
            <InputBox
              htmlFor="email"
              label="Email"
              id="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => {
                setEmail(e.target.value);
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
            {/* Confirm Password Input */}
            <InputBox
              type="password"
              htmlFor="confirmPassword"
              label="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              placeholder="Repeat your password"
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign Up
            </button>

            {/* Login Link */}
            <div className="text-center mt-4 text-sm text-gray-600">
              Already have an account?
              <a href="/login" className="text-blue-600 hover:underline ml-1">
                Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
