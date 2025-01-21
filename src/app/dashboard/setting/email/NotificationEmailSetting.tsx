import React, { useState } from "react";
import { Typography, message } from "antd";

const { Title } = Typography;

export default function NotificationEmailSetting() {
  const [email, setEmail] = useState<string>("");
  const [emailList, setEmailList] = useState<string[]>([]);

  const handleAddEmail = () => {
    if (!email) {
      message.warning("Please enter an email address.");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      message.error("Invalid email format.");
      return;
    }

    if (emailList.includes(email)) {
      message.warning("Email already added.");
      return;
    }

    setEmailList((prevList) => [...prevList, email]);
    setEmail("");
    message.success("Email added successfully.");
  };

  return (
    <div >
      <Title level={3} className="text-lg font-semibold text-center mb-4">
        Enter the list of emails in which you want to get notification as the new order placed
      </Title>
  
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter user email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddEmail()}
          className="w-full p-2 border border-gray-300 rounded mb-2"
        />
        <button
          onClick={handleAddEmail}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Add Email
        </button>
      </div>
      <div className="bg-white shadow rounded p-4">
        <h4 className="font-medium mb-2">Added Emails</h4>
        <ul className="list-disc pl-5">
          {emailList.map((item, index) => (
            <li key={index} className="text-gray-700 mb-1">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
