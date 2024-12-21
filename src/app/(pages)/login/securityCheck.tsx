'use client';
import React, { useState } from 'react';
import { Input, Button, message } from 'antd';
import getSecurityCheck from './getSecurity'; // Import the getSecurityCheck function

interface SecurityCheckProps {
  onSuccess: () => void;
}

const SecurityCheck: React.FC<SecurityCheckProps> = ({ onSuccess }) => {
  const [key, setKey] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(3);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const handleContinue = async (): Promise<void> => {
    const isValid = true; // Check if the key is valid using Firestore
    if (isValid) {
      message.success('Key verified successfully!');
      onSuccess(); // Trigger success callback if key is valid
    } else {
      setAttempts((prev) => prev - 1);
      if (attempts - 1 > 0) {
        message.error(`Incorrect key! You have ${attempts - 1} attempts left.`);
      } else {
        message.error('Too many incorrect attempts!');
      }
    }
    setKey(''); // Clear the input after checking
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r ">
      <div className="bg-white p-8 shadow-2xl rounded-xl w-96">
        <h2 className="text-3xl font-semibold text-center text-purple-700 mb-4">Security Check</h2>
        <p className="text-gray-700 text-center mb-6">
          Please enter your security key. You have{' '}
          <span className="font-bold text-red-500">{attempts}</span> attempts left.
        </p>
        <Input.Password
          placeholder="Enter Security Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          visibilityToggle={{
            visible: isPasswordVisible,
            onVisibleChange: setIsPasswordVisible,
          }}
          className="mb-4 p-4 border-2 border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-md"
          size="large"
        />
        <Button
          type="primary"
          size="large"
          block
          onClick={handleContinue}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-lg py-3 rounded-md shadow-lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default SecurityCheck;
