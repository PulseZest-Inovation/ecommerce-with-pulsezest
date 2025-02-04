import Head from 'next/head';

const TermsOfService = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto text-gray-700">
      <Head>
        <title>Terms of Service</title>
      </Head>
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p>By using our platform, you agree to these Terms of Service. Please read them carefully before using our services.</p>
      
      <h2 className="text-2xl font-semibold mt-6">User Responsibilities</h2>
      <ul className="list-disc list-inside mt-2">
        <li>You must provide accurate information when registering.</li>
        <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6">Prohibited Activities</h2>
      <ul className="list-disc list-inside mt-2">
        <li>Using the platform for illegal activities.</li>
        <li>Attempting to access unauthorized data.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6">Limitation of Liability</h2>
      <p>We are not liable for any damages resulting from the use or inability to use our platform.</p>

      <h2 className="text-2xl font-semibold mt-6">Changes to Terms</h2>
      <p>We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of the updated terms.</p>

      <h2 className="text-2xl font-semibold mt-6">Contact Us</h2>
      <p>For any inquiries, email us at <a href="mailto:support@yourdomain.com" className="text-blue-600 underline">support@yourdomain.com</a>.</p>
    </div>
  );
};

export default TermsOfService;
