import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./authContext";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      navigate("/navbar");
    } catch (err) {
      // Here you can log the error to the console for debugging
      console.error(err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="absolute top-0 left-0 p-4 flex items-center">
        <img
          src="/HelpDesk-logo.png"
          alt="HelpDesk logo"
          className="mr-2 w-7 h-7"
        />
        <span className="text-xl font-semibold">HelpDesk</span>
      </div>
      <div className="absolute top-0 right-0 p-4">
        <button className="border border-gray-300 rounded-full px-4 py-1 text-sm">
          Sign up free
        </button>
      </div>

      <div className="mt-16 w-full max-w-md px-4">
        <h2 className="text-2xl font-semibold text-center mb-6">Log in</h2>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Business email
            </label>
            <input
              type="email"
              placeholder="name@work-email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i
                  className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash"} text-gray-400`}
                ></i>
              </div>
            </div>
            <div className="text-right mt-1">
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full ${loading ? "bg-gray-500" : "bg-blue-600"} text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="mt-6 space-y-3">
          <button className="w-full border border-gray-300 rounded-md py-2 text-sm font-medium flex items-center justify-center" style={{ width: '200px', marginLeft: '100px', marginRight: '50px' }}>
            <img
              src="/download.png"
              alt="Google logo"
              className="mr-2 w-5 h-5"
            />
            Log in with Google
          </button>
          <button className="w-full border border-gray-300 rounded-md py-2 text-sm font-medium flex items-center justify-center" style={{ width: '200px', marginLeft: '100px', marginRight: '50px' }}>
            <img
              src="/micro.png"
              alt="Microsoft logo"
              className="mr-2 w-5 h-5"
            />
            Log in with Microsoft
          </button>
          <div className="flex justify-center">
            <a
              href={`https://appleid.apple.com/auth/authorize?client_id=com.livechat.accounts&redirect_uri=https%3A%2F%2Faccounts.livechat.com%2Foauth%2Fapple%2Fcallback&response_mode=form_post&response_type=code&scope=email+name&state=a7e43731-ef9c-4ae8-9e70-463fe617ab9f`}
              className="border border-gray-300 rounded-md py-2 text-sm font-medium flex items-center justify-center no-underline text-black"
              style={{ width: '200px', marginLeft: '50px', marginRight: '50px' }}
            >
              <img src="/apple.jpg" alt="Apple logo" className="mr-2 w-5 h-5" />
              Log in with Apple
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
