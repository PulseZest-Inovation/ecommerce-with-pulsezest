import Head from 'next/head';

const PrivacyPolicy = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto text-gray-700">
      <Head>
        <title>Privacy Policy</title>
      </Head>
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p>Welcome to our platform. Your privacy is important to us, and we are committed to protecting your data.</p>
      
      <h2 className="text-2xl font-semibold mt-6">Information We Collect</h2>
      <ul className="list-disc list-inside mt-2">
        <li><strong>Personal Information:</strong> Name, email, contact details.</li>
        <li><strong>Usage Data:</strong> How you interact with our platform.</li>
        <li><strong>Cookies & Tracking Technologies:</strong> For improving user experience.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6">How We Use Your Information</h2>
      <p>We use your information to provide and maintain our services, improve user experience, and communicate updates.</p>

      <h2 className="text-2xl font-semibold mt-6">Data Protection</h2>
      <p>We implement strict security measures to protect your personal data from unauthorized access, alteration, or destruction.</p>

      <h2 className="text-2xl font-semibold mt-6">Your Rights</h2>
      <p>You have the right to access, update, or delete your data at any time. Contact us for any privacy-related concerns.</p>

      <h2 className="text-2xl font-semibold mt-6">Contact Us</h2>
      <p>If you have any questions, email us at <a href="mailto:support@pulsezest.com" className="text-blue-600 underline">support@pulsezest.com</a>.</p>
    </div>
  );
};

export default PrivacyPolicy;
