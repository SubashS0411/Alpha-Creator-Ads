import React from 'react';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/" className="text-purple-600 hover:text-purple-700 flex items-center gap-2 mb-4">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">Terms and Conditions</h1>
          <p className="text-gray-600 mt-2">Last updated: November 26, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to Alpha Creator Ads. By accessing or using our advertising platform and services, 
              you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these 
              Terms, please do not use our services. These Terms constitute a legally binding agreement 
              between you and Alpha Creator Ads.
            </p>
          </section>

          {/* Definitions */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Definitions</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>"Platform"</strong> refers to the Alpha Creator Ads website, application, and services</li>
              <li><strong>"User," "you," or "your"</strong> refers to the individual or entity using our services</li>
              <li><strong>"We," "us," or "our"</strong> refers to Alpha Creator Ads</li>
              <li><strong>"Content"</strong> includes all advertisements, materials, and data uploaded to the Platform</li>
              <li><strong>"Campaign"</strong> refers to advertising campaigns created and managed through our Platform</li>
            </ul>
          </section>

          {/* Account Registration */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Account Registration and Security</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.1 Account Creation</h3>
            <p className="text-gray-700 mb-4">To use our services, you must:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Be at least 18 years of age</li>
              <li>Provide accurate, complete, and current information</li>
              <li>Maintain and update your account information</li>
              <li>Have the legal authority to enter into this agreement</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.2 Account Security</h3>
            <p className="text-gray-700 mb-4">You are responsible for:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Maintaining the confidentiality of your password</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized access</li>
              <li>Using strong passwords and security measures</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.3 Account Termination</h3>
            <p className="text-gray-700">
              We reserve the right to suspend or terminate accounts that violate these Terms or engage 
              in fraudulent, abusive, or illegal activities.
            </p>
          </section>

          {/* Services */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Services and Features</h2>
            <p className="text-gray-700 mb-4">Our Platform provides:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>AI-powered advertising content generation</li>
              <li>Multi-platform campaign management (Google, Facebook, Instagram, LinkedIn, etc.)</li>
              <li>Advanced targeting and audience segmentation</li>
              <li>Real-time analytics and performance tracking</li>
              <li>Budget management and optimization tools</li>
              <li>Campaign scheduling and automation</li>
            </ul>
            <p className="text-gray-700 mt-4">
              We reserve the right to modify, suspend, or discontinue any feature at any time with or 
              without notice.
            </p>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Acceptable Use Policy</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">5.1 Permitted Use</h3>
            <p className="text-gray-700 mb-4">You may use our Platform for:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Creating and managing legitimate advertising campaigns</li>
              <li>Promoting lawful products and services</li>
              <li>Analyzing campaign performance</li>
              <li>Accessing features included in your subscription plan</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">5.2 Prohibited Activities</h3>
            <p className="text-gray-700 mb-4">You must NOT:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Upload illegal, fraudulent, or misleading content</li>
              <li>Promote illegal products, services, or activities</li>
              <li>Violate intellectual property rights</li>
              <li>Engage in spam, phishing, or malicious activities</li>
              <li>Attempt to hack, compromise, or disrupt the Platform</li>
              <li>Use automated systems to access the Platform without authorization</li>
              <li>Resell or redistribute our services without permission</li>
              <li>Create false or misleading advertisements</li>
              <li>Discriminate based on protected characteristics</li>
              <li>Promote adult content, weapons, drugs, or harmful products (subject to restrictions)</li>
            </ul>
          </section>

          {/* Content */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. User Content and Intellectual Property</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">6.1 Your Content</h3>
            <p className="text-gray-700 mb-4">
              You retain ownership of all content you upload. However, by uploading content to our 
              Platform, you grant us a worldwide, non-exclusive, royalty-free license to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Use, reproduce, and display your content to provide our services</li>
              <li>Modify and adapt content for technical compatibility</li>
              <li>Distribute your content to advertising platforms</li>
              <li>Generate AI-enhanced variations of your content</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">6.2 Content Responsibility</h3>
            <p className="text-gray-700 mb-4">You represent and warrant that:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>You own or have rights to all content you upload</li>
              <li>Your content does not infringe third-party rights</li>
              <li>Your content complies with all applicable laws</li>
              <li>You have necessary permissions for any personal data in your content</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">6.3 Our Intellectual Property</h3>
            <p className="text-gray-700">
              All Platform features, designs, logos, and technology are owned by us and protected by 
              intellectual property laws. You may not copy, modify, or create derivative works without 
              our written permission.
            </p>
          </section>

          {/* Payment Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Payment Terms</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">7.1 Subscription Plans</h3>
            <p className="text-gray-700 mb-4">
              We offer various subscription plans with different features and pricing. Current plans 
              include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Free Plan:</strong> Limited features and campaign volume</li>
              <li><strong>Pro Plan:</strong> Enhanced features and increased limits</li>
              <li><strong>Enterprise Plan:</strong> Unlimited access and premium support</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">7.2 Billing</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Subscriptions are billed in advance on a monthly or annual basis</li>
              <li>All fees are non-refundable unless otherwise stated</li>
              <li>Prices may change with 30 days notice</li>
              <li>You authorize automatic recurring charges</li>
              <li>Failed payments may result in service suspension</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">7.3 Advertising Costs</h3>
            <p className="text-gray-700">
              You are responsible for all advertising costs charged by third-party platforms (Google Ads, 
              Facebook Ads, etc.). These costs are separate from our subscription fees and are billed 
              directly by the advertising platforms.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">7.4 Refunds</h3>
            <p className="text-gray-700">
              Refunds are provided at our discretion and only in cases of service failure or billing 
              errors. Contact support within 7 days of charge for refund requests.
            </p>
          </section>

          {/* Warranties */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimers and Warranties</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
              <p className="text-gray-800 font-semibold mb-2">IMPORTANT DISCLAIMER:</p>
              <p className="text-gray-700 mb-4">
                OUR PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
                EITHER EXPRESS OR IMPLIED.
              </p>
              <p className="text-gray-700 mb-4">We do not warrant that:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>The Platform will be uninterrupted, secure, or error-free</li>
                <li>AI-generated content will meet your expectations or requirements</li>
                <li>Your campaigns will achieve specific results or ROI</li>
                <li>Third-party advertising platforms will approve your campaigns</li>
                <li>Data will be completely accurate or up-to-date</li>
              </ul>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded">
              <p className="text-gray-800 font-semibold mb-2">LIABILITY LIMITATIONS:</p>
              <p className="text-gray-700 mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Indirect, incidental, special, consequential, or punitive damages</li>
                <li>Loss of profits, revenue, data, or business opportunities</li>
                <li>Service interruptions or data loss</li>
                <li>Third-party actions or content</li>
                <li>Campaign performance or advertising results</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Our total liability shall not exceed the amount you paid us in the 12 months preceding 
                the claim, or $100, whichever is greater.
              </p>
            </div>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Indemnification</h2>
            <p className="text-gray-700 mb-4">
              You agree to indemnify and hold us harmless from any claims, damages, losses, or expenses 
              (including legal fees) arising from:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Your use of the Platform</li>
              <li>Your content or campaigns</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any laws or third-party rights</li>
            </ul>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Third-Party Services</h2>
            <p className="text-gray-700 mb-4">
              Our Platform integrates with third-party advertising platforms and services. You acknowledge 
              that:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Third-party services have their own terms and policies</li>
              <li>We are not responsible for third-party actions or policies</li>
              <li>Third-party availability may affect our services</li>
              <li>You must comply with all third-party requirements</li>
            </ul>
          </section>

          {/* Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Privacy and Data Protection</h2>
            <p className="text-gray-700">
              Your privacy is important to us. Our collection and use of personal information is governed 
              by our{' '}
              <Link to="/privacy" className="text-purple-600 hover:text-purple-700 font-medium">
                Privacy Policy
              </Link>
              , which is incorporated into these Terms by reference.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Termination</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">13.1 Termination by You</h3>
            <p className="text-gray-700">
              You may terminate your account at any time through account settings. Termination does not 
              entitle you to refunds for unused subscription periods.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">13.2 Termination by Us</h3>
            <p className="text-gray-700 mb-4">We may terminate or suspend your account if:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>You violate these Terms</li>
              <li>You engage in fraudulent or illegal activities</li>
              <li>Your account remains inactive for an extended period</li>
              <li>Required by law or legal authority</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">13.3 Effect of Termination</h3>
            <p className="text-gray-700">
              Upon termination, your access will cease immediately. We may retain certain data as required 
              by law or for legitimate business purposes.
            </p>
          </section>

          {/* Dispute Resolution */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Dispute Resolution</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">14.1 Informal Resolution</h3>
            <p className="text-gray-700">
              Before initiating formal proceedings, please contact us at{' '}
              <a href="mailto:legal@alphaads.com" className="text-purple-600 hover:text-purple-700">
                legal@alphaads.com
              </a>{' '}
              to resolve the dispute informally.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">14.2 Arbitration</h3>
            <p className="text-gray-700">
              Any disputes not resolved informally shall be settled by binding arbitration in accordance 
              with applicable arbitration rules. You waive your right to participate in class actions.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">14.3 Governing Law</h3>
            <p className="text-gray-700">
              These Terms shall be governed by and construed in accordance with the laws of [Your 
              Jurisdiction], without regard to conflict of law provisions.
            </p>
          </section>

          {/* General Provisions */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. General Provisions</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">15.1 Modifications</h3>
            <p className="text-gray-700">
              We may modify these Terms at any time. Material changes will be notified via email or 
              Platform notice. Continued use after changes constitutes acceptance.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">15.2 Entire Agreement</h3>
            <p className="text-gray-700">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you 
              and us regarding the Platform.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">15.3 Severability</h3>
            <p className="text-gray-700">
              If any provision is found invalid or unenforceable, the remaining provisions shall remain 
              in full force and effect.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">15.4 Waiver</h3>
            <p className="text-gray-700">
              Our failure to enforce any right or provision shall not constitute a waiver of such right 
              or provision.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">15.5 Assignment</h3>
            <p className="text-gray-700">
              You may not assign these Terms without our consent. We may assign our rights and obligations 
              without restriction.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">15.6 Force Majeure</h3>
            <p className="text-gray-700">
              We shall not be liable for delays or failures due to circumstances beyond our reasonable 
              control, including natural disasters, wars, or technical failures.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              For questions about these Terms, please contact us:
            </p>
            <div className="bg-purple-50 rounded-lg p-6 space-y-2">
              <p className="text-gray-800"><strong>Alpha Creator Ads</strong></p>
              <p className="text-gray-700">Legal Department</p>
              <p className="text-gray-700">Email: legal@alphaads.com</p>
              <p className="text-gray-700">Support: support@alphaads.com</p>
              <p className="text-gray-700">Address: [Your Business Address]</p>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="bg-gray-50 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Acknowledgment
            </h3>
            <p className="text-gray-700">
              BY USING THE ALPHA CREATOR ADS PLATFORM, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, 
              AND AGREE TO BE BOUND BY THESE TERMS AND CONDITIONS.
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center space-x-6">
          <Link to="/privacy" className="text-purple-600 hover:text-purple-700 font-medium">
            Privacy Policy
          </Link>
          <Link to="/" className="text-gray-600 hover:text-gray-700 font-medium">
            Home
          </Link>
          <a href="mailto:legal@alphaads.com" className="text-gray-600 hover:text-gray-700 font-medium">
            Legal Contact
          </a>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
