import React from 'react';
import { Link } from 'react-router-dom';

const googleLogo = 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png';
const githubLogo = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-700 to-black">
      <div className="bg-white shadow-2xl rounded-lg p-6 max-w-sm w-full transform hover:scale-105 transition-transform duration-300">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Log In</h2>
        <div className="flex flex-col space-y-3">
          <button className="flex items-center justify-center p-2 border border-gray-300 rounded-md shadow-md bg-white hover:bg-gray-200 transition">
            <img src={googleLogo} alt="Google" className="w-5 h-5 mr-2" />
            <span className="text-gray-700 font-semibold">Log in with Google</span>
          </button>
          <button className="flex items-center justify-center p-2 border border-gray-300 rounded-md shadow-md bg-white hover:bg-gray-200 transition">
            <img src={githubLogo} alt="GitHub" className="w-5 h-5 mr-2" />
            <span className="text-gray-700 font-semibold">Log in with GitHub</span>
          </button>
        </div>
        <div className="mt-4 text-center">
          <p className="text-gray-600">or log in with email</p>
          <input
            type="email"
            placeholder="Email"
            className="mt-3 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="mt-3 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 rounded-md shadow-lg hover:from-blue-600 hover:to-indigo-600 transition">
            Log In
          </button>
          <p className="mt-4 text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-500 hover:text-blue-700 transition">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
