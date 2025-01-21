'use client'
import React, { useState, useEffect } from "react";
import { Typography, message } from "antd";
import { getDataByDocName } from "@/services/FirestoreData/getFirestoreData";
import { updateDocWithCustomId } from "@/services/FirestoreData/updateFirestoreData";

const { Title } = Typography;

export default function NotificationEmailSetting() {
  const [email, setEmail] = useState<string>("");
  const [emailList, setEmailList] = useState<string[]>([]);

  const docName = "email-setting";
  const collectionName = "settings";

  // Fetching email list on component mount
  useEffect(() => {
    const fetchEmailList = async () => {
      const data = await getDataByDocName<{ emailList: string[] }>(
        collectionName,
        docName
      );
      if (data && data.emailList) {
        setEmailList(data.emailList);
      }
    };

    fetchEmailList();
  }, []);

  const handleAddEmail = async () => {
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

    const newEmailList = [...emailList, email];
    setEmailList(newEmailList);
    setEmail("");

    // Save updated email list to Firestore
    const success = await updateEmailList(newEmailList);
    if (success) {
      message.success("Email added successfully.");
    } else {
      message.error("Failed to update email list.");
    }
  };

  // Function to update email list in Firestore
  const updateEmailList = async (newEmailList: string[]): Promise<boolean> => {
    const data = { emailList: newEmailList };
    return await updateDocWithCustomId(collectionName, docName, data);
  };

  // Handle deleting an email by its index
  const handleDeleteEmail = async (index: number) => {
    const newEmailList = [...emailList];
    newEmailList.splice(index, 1); // Remove email at the specified index
    setEmailList(newEmailList);

    // Save updated email list to Firestore
    const success = await updateEmailList(newEmailList);
    if (success) {
      message.success("Email deleted successfully.");
    } else {
      message.error("Failed to update email list.");
    }
  };

  return (
    <div>
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
            <li key={index} className="text-gray-700 mb-1 flex justify-between items-center">
              <span>{item}</span>
              <button
                onClick={() => handleDeleteEmail(index)}
                className="text-red-500 ml-2 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
