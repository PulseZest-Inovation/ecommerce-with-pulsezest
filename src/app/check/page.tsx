'use client'
import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData'
import React, { useEffect, useState } from 'react'

interface CustomerType {
    id: string;          // Include the id field from Firestore
    fullName: string;
    phoneNumber: string;
    profileUrl: string;
}

export default function CheckingPage() {

    // Initialize customer as an array
    const [customers, setCustomers] = useState<CustomerType[]>([]);

    const fetchCustomer = async () => {
        try {
            // Fetch the customers from Firestore
            const customersData = await getAllDocsFromCollection<CustomerType>('customers');
            setCustomers(customersData); // Set the fetched customers into state
            console.log(customersData); // Log the customers
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    }

    useEffect(() => {
        fetchCustomer();
    }, []); // Empty dependency array so it runs only once

    return (
        <div>
            {/* Check if customers array is not empty */}
            {customers.length > 0 ? (
                customers.map((customer) => (
                    <div key={customer.id}>  {/* Use customer.id as the key */}
                        <h3>{customer.fullName}</h3>
                        <p>{customer.phoneNumber}</p>
                        <img src={customer.profileUrl} alt={customer.fullName} width={50} />
                    </div>
                ))
            ) : (
                <p>No customers found</p>
            )}
        </div>
    );
}
