import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/" className="text-purple-600 hover:text-purple-700 flex items-center gap-2 mb-4">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="text-gray-600 mt-2">Last updated: November 26, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to Alpha Creator Ads ("we," "our," or "us"). We are committed to protecting your 
              privacy and ensuring the security of your personal information. This Privacy Policy explains 
              how we collect, use, disclose, and safeguard your information when you use our advertising 
              platform and services.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">2.1 Information You Provide</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Account Information:</strong> Name, email address, username, password</li>
              <li><strong>Profile Information:</strong> Company name, business details, contact information</li>
              <li><strong>Payment Information:</strong> Billing address, payment method details (processed securely by third-party payment processors)</li>
              <li><strong>Campaign Data:</strong> Advertising content, targeting preferences, budget information</li>
              <li><strong>Communications:</strong> Messages, feedback, and support inquiries</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">2.2 Automatically Collected Information</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent on platform</li>
              <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
              <li><strong>Cookies and Tracking:</strong> Session data, preferences, analytics information</li>
              <li><strong>Campaign Performance:</strong> Impressions, clicks, conversions, engagement metrics</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">We use your information to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Provide, maintain, and improve our advertising platform</li>
              <li>Process your transactions and manage your account</li>
              <li>Deliver and optimize advertising campaigns</li>
              <li>Generate AI-powered ad content and recommendations</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Send service updates, security alerts, and administrative messages</li>
              <li>Analyze usage patterns and improve user experience</li>
              <li>Detect, prevent, and address fraud and security issues</li>
              <li>Comply with legal obligations and enforce our terms</li>
              <li>Send marketing communications (with your consent)</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
            <p className="text-gray-700 mb-4">We may share your information with:</p>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.1 Service Providers</h3>
            <p className="text-gray-700 mb-2">
              Third-party vendors who help us operate our platform, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Cloud hosting and storage providers</li>
              <li>Payment processors</li>
              <li>Email service providers</li>
              <li>Analytics services</li>
              <li>AI and machine learning services</li>
              <li>Advertising platforms (Google Ads, Facebook Ads, etc.)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.2 Legal Requirements</h3>
            <p className="text-gray-700">
              We may disclose your information if required by law, court order, or to protect our 
              rights, safety, or property.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.3 Business Transfers</h3>
            <p className="text-gray-700">
              In connection with mergers, acquisitions, or sale of assets, your information may be 
              transferred to the acquiring entity.
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure authentication with JWT tokens</li>
              <li>Regular security audits and monitoring</li>
              <li>Access controls and employee training</li>
              <li>Secure backup and disaster recovery procedures</li>
            </ul>
            <p className="text-gray-700 mt-4">
              However, no method of transmission over the Internet is 100% secure, and we cannot 
              guarantee absolute security.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Privacy Rights</h2>
            <p className="text-gray-700 mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Restrict Processing:</strong> Limit how we use your information</li>
              <li><strong>Object:</strong> Object to processing of your information</li>
            </ul>
            <p className="text-gray-700 mt-4">
              To exercise these rights, contact us at{' '}
              <a href="mailto:privacy@alphaads.com" className="text-purple-600 hover:text-purple-700">
                privacy@alphaads.com
              </a>
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 mb-4">
              We use cookies and similar technologies to enhance your experience:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Essential Cookies:</strong> Required for platform functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand usage patterns</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Advertising Cookies:</strong> Deliver relevant ads and measure campaign performance</li>
            </ul>
            <p className="text-gray-700 mt-4">
              You can control cookies through your browser settings, but disabling them may affect 
              platform functionality.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Retention</h2>
            <p className="text-gray-700">
              We retain your information for as long as necessary to provide our services and comply 
              with legal obligations. Account data is deleted within 30 days of account closure, unless 
              retention is required by law. Campaign data and analytics may be retained for up to 7 years 
              for business and compliance purposes.
            </p>
          </section>

          {/* International Transfers */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Data Transfers</h2>
            <p className="text-gray-700">
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place to protect your information in accordance 
              with applicable data protection laws.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Children's Privacy</h2>
            <p className="text-gray-700">
              Our services are not directed to individuals under 18 years of age. We do not knowingly 
              collect personal information from children. If you believe we have collected information 
              from a child, please contact us immediately.
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy periodically. We will notify you of material changes 
              by email or through a prominent notice on our platform. Your continued use of our services 
              after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-purple-50 rounded-lg p-6 space-y-2">
              <p className="text-gray-800"><strong>Alpha Creator Ads</strong></p>
              <p className="text-gray-700">Email: privacy@alphaads.com</p>
              <p className="text-gray-700">Support: support@alphaads.com</p>
              <p className="text-gray-700">Address: [Your Business Address]</p>
            </div>
          </section>

          {/* GDPR/CCPA Notice */}
          <section className="bg-blue-50 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Notice for EU and California Residents
            </h3>
            <p className="text-gray-700 mb-2">
              <strong>EU Users (GDPR):</strong> You have additional rights under the General Data 
              Protection Regulation, including the right to lodge a complaint with your local supervisory 
              authority.
            </p>
            <p className="text-gray-700">
              <strong>California Users (CCPA):</strong> You have the right to know what personal 
              information we collect, request deletion, and opt-out of the sale of your information 
              (we do not sell personal information).
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center space-x-6">
          <Link to="/terms" className="text-purple-600 hover:text-purple-700 font-medium">
            Terms & Conditions
          </Link>
          <Link to="/" className="text-gray-600 hover:text-gray-700 font-medium">
            Home
          </Link>
          <a href="mailto:support@alphaads.com" className="text-gray-600 hover:text-gray-700 font-medium">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
