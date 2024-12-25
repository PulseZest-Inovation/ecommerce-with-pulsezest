'use client'
import React from 'react';
import { Input, Button } from 'antd';

type Props = {
  handleLogin: (email: string, password: string) => void;
  loading: boolean;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
};

export default function LoginToEcommerce({
  handleLogin,
  loading,
  email,
  setEmail,
  password,
  setPassword,
}: Props) {
  const onLoginClick = () => {
    handleLogin(email, password); // Call handleLogin with the current email and password
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg w-96 z-10">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
        Administration Login
      </h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update email state
            className="w-full border-gray-300 focus:border-blue-600 focus:ring-blue-600"
            size="large"
            aria-label="Email Address"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <Input.Password
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state
            className="w-full border-gray-300 focus:border-blue-600 focus:ring-blue-600"
            size="large"
            aria-label="Password"
          />
        </div>
        <Button
          type="primary"
          size="large"
          block
          onClick={onLoginClick}
          className="bg-blue-600 hover:bg-blue-700 text-white border-none"
          loading={loading}
        >
          Login
        </Button>
      </form>
    </div>
  );
}
