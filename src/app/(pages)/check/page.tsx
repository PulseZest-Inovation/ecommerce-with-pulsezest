'use client'
import React, { useState } from 'react';
import { db } from '../../../utils/firbeaseConfig'; // Adjust the import path
import { collection, addDoc } from 'firebase/firestore';
 

const Check = () => {
  const [message, setMessage] = useState<string>('');

  // Function to handle button click and save data to Firestore
  const handleSaveData = async () => {
    try {
      // Add data to Firestore (e.g., collection 'testData')
      const docRef = await addDoc(collection(db, 'testData'), {
        name: 'Test Name',  // Replace with the data you want to store
        description: 'This is a test description.',
        timestamp: new Date(),
      });
      

      setMessage(`Document written with ID: ${docRef.id}`);
    } catch (error) {
      setMessage(`Error adding document: ${error}`);
    }
  };

  return (
    <div>
      <button onClick={handleSaveData} className="px-4 py-2 bg-blue-500 text-white rounded">
        Save Data to Firestore
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Check;


//addDoc is a function in which this will requrie two paramenter one is a function and another is an object of data.
//the firstparement fucntion name is collection which get likes this- collection(db, 'collectionName') 
//and the second arguements is an object which is like this - {} and inside this object we will add the key and value what ever we want to save.