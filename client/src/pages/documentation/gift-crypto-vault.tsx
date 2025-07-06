import React from 'react';
import { Helmet } from 'react-helmet';
import DocumentationLayout from '@/components/layout/DocumentationLayout';

export default function GiftCryptoVaultDocumentation() {
  return (
    <>
      <Helmet>
        <title>Gift Crypto Vault Documentation | Chronos Vault</title>
        <meta 
          name="description" 
          content="Learn about our Gift Crypto Vault - create memorable crypto gifts with time-locked conditions and personalized messages." 
        />
      </Helmet>
      
      <DocumentationLayout
        title="Gift Crypto Vault"
        description="Create memorable crypto gifts with meaningful release conditions"
        icon="🎁"
      >
        <div className="space-y-10">
          {/* Overview Section */}
          <section id="overview">
            <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
            <div className="prose prose-invert max-w-none">
              <p>
                The Gift Crypto Vault is a specialized vault type designed to transform cryptocurrency into meaningful 
                and memorable gifts for friends, family members, or loved ones. Unlike traditional gifting methods, 
                our Gift Crypto Vault combines the financial value of cryptocurrency with emotional and sentimental value, 
                creating a unique gifting experience that grows in value over time.
              </p>
              <p>
                Gift Crypto Vaults can be customized with personal messages, special conditions for unlocking, 
                and can be scheduled to release on specific dates like birthdays, anniversaries, or graduation days.
                This creates not just a monetary gift, but a digital time capsule that can be treasured for years to come.
              </p>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-purple-300 mb-3">Perfect For</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-pink-400 mr-2">•</span>
                    <span>Birthday gifts with future release dates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-400 mr-2">•</span>
                    <span>Graduation presents that grow in value</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-400 mr-2">•</span>
                    <span>Wedding gifts with anniversary unlock dates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-400 mr-2">•</span>
                    <span>Baby shower gifts for future education</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-400 mr-2">•</span>
                    <span>Retirement gifts with personalized messages</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 border border-pink-500/30 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-pink-300 mb-3">Key Benefits</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span>Personalized with messages, photos, and videos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span>Time-locked for special occasion release</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span>Potential for value appreciation over time</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span>Secure triple-chain protection against loss</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span>Receiver-friendly with easy onboarding</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
          
          {/* Features Section */}
          <section id="features">
            <h2 className="text-2xl font-bold text-white mb-4">Key Features</h2>
            
            <div className="space-y-6">
              <div className="border border-purple-500/30 rounded-lg p-6 bg-gradient-to-r from-purple-950/40 to-transparent">
                <h3 className="text-xl font-semibold text-purple-300 mb-2">Personalized Multimedia Messages</h3>
                <p className="text-gray-300">
                  Attach personal messages, photos, videos, or audio recordings to your gift, creating a multisensory 
                  experience that makes your gift unique and meaningful. Recipients will feel the emotional connection 
                  when they eventually access their gift.
                </p>
              </div>
              
              <div className="border border-pink-500/30 rounded-lg p-6 bg-gradient-to-r from-pink-950/40 to-transparent">
                <h3 className="text-xl font-semibold text-pink-300 mb-2">Custom Time-Lock Conditions</h3>
                <p className="text-gray-300">
                  Set precise date and time conditions for when the gift can be accessed. Perfect for birthdays, 
                  anniversaries, graduations, or any special occasion. The vault remains securely locked until the 
                  predetermined time arrives.
                </p>
              </div>
              
              <div className="border border-purple-500/30 rounded-lg p-6 bg-gradient-to-r from-purple-950/40 to-transparent">
                <h3 className="text-xl font-semibold text-purple-300 mb-2">Achievement-Based Unlocking</h3>
                <p className="text-gray-300">
                  Create gifts that unlock when specific life achievements are met - like graduation, buying a first home, 
                  or reaching a certain age. These conditions can be verified through our secure verification system.
                </p>
              </div>
              
              <div className="border border-pink-500/30 rounded-lg p-6 bg-gradient-to-r from-pink-950/40 to-transparent">
                <h3 className="text-xl font-semibold text-pink-300 mb-2">Recipient-Friendly Access</h3>
                <p className="text-gray-300">
                  Even if your gift recipient is new to cryptocurrency, our user-friendly interface makes it easy for them 
                  to access their gift when the time comes. Simple email notifications and guided setup ensure a smooth experience.
                </p>
              </div>

              <div className="border border-purple-500/30 rounded-lg p-6 bg-gradient-to-r from-purple-950/40 to-transparent">
                <h3 className="text-xl font-semibold text-purple-300 mb-2">Appreciation Potential</h3>
                <p className="text-gray-300">
                  Unlike traditional gifts that often depreciate, cryptocurrency gifts have the potential to appreciate in value 
                  over time. A modest gift today could become significantly more valuable by the time it's accessed.
                </p>
              </div>

              <div className="border border-pink-500/30 rounded-lg p-6 bg-gradient-to-r from-pink-950/40 to-transparent">
                <h3 className="text-xl font-semibold text-pink-300 mb-2">Cross-Chain Compatibility</h3>
                <p className="text-gray-300">
                  Gift crypto across multiple blockchain networks, including Ethereum, Solana, TON, and Bitcoin. This flexibility 
                  allows you to choose the cryptocurrency that best aligns with your gifting goals.
                </p>
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section id="security">
            <h2 className="text-2xl font-bold text-white mb-4">Security Features</h2>
            <div className="prose prose-invert max-w-none mb-6">
              <p>
                Gift Crypto Vaults implement our advanced Triple-Chain Security™ architecture to ensure the safety and 
                integrity of your gifts across multiple blockchains.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-3">Gift Recovery Protection</h3>
                <p className="text-gray-400">
                  If a recipient loses access to their wallet, our social recovery system allows them to regain access to their gift 
                  through a secure multi-factor verification process.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-3">Emergency Access Options</h3>
                <p className="text-gray-400">
                  Gift givers can optionally set up emergency access conditions, allowing the gift to be accessed under certain 
                  circumstances even before the intended unlock date.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-3">Transaction Verification</h3>
                <p className="text-gray-400">
                  Each gift transaction is verified across multiple blockchains, creating redundant security that prevents 
                  unauthorized access and ensures the gift reaches its intended recipient.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-3">Multimedia Encryption</h3>
                <p className="text-gray-400">
                  All personal messages, photos, videos, and other multimedia content attached to the gift are encrypted using 
                  advanced cryptography, ensuring only the recipient can access them.
                </p>
              </div>
            </div>
          </section>

          {/* Technical Details */}
          <section id="technical-details">
            <h2 className="text-2xl font-bold text-white mb-4">Technical Architecture</h2>
            <div className="bg-gradient-to-r from-gray-900 to-gray-950 border border-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-blue-300 mb-4">Multi-Chain Implementation</h3>
              <div className="space-y-4 text-gray-300">
                <div>
                  <h4 className="font-medium text-blue-200">Cross-Chain Security Protocol</h4>
                  <p className="text-sm text-gray-400 mt-1">
                    Gift Crypto Vaults leverage our proprietary Cross-Chain Security Protocol to ensure that gifts are securely 
                    locked and can only be accessed by the intended recipient when conditions are met.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-blue-200">Time-Lock Smart Contracts</h4>
                  <p className="text-sm text-gray-400 mt-1">
                    Ethereum and Solana-based gifts utilize specialized time-lock smart contracts that ensure the gifted assets 
                    cannot be accessed until the specified time or condition parameters are met.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-blue-200">Media Storage Architecture</h4>
                  <p className="text-sm text-gray-400 mt-1">
                    Multimedia components (images, videos, audio) are encrypted and stored using a hybrid approach:
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Metadata - Stored on-chain for immutability</li>
                      <li>Media files - Encrypted and stored using decentralized storage (Arweave)</li>
                      <li>Access keys - Fragmented across multiple chains for enhanced security</li>
                    </ul>
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-blue-200">Recovery Mechanism</h4>
                  <p className="text-sm text-gray-400 mt-1">
                    Our Trustless Recovery Protocol allows gift recipients to recover access to their gifts even if they lose their 
                    original wallet credentials, through a secure multi-factor verification process.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section id="faq">
            <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div className="border border-gray-800 rounded-lg overflow-hidden">
                <div className="bg-gray-900 px-6 py-4">
                  <h3 className="text-lg font-medium text-white">Can the gift recipient access their gift before the unlock date?</h3>
                </div>
                <div className="px-6 py-4 bg-gray-800/50">
                  <p className="text-gray-300">
                    By default, gifts are locked until the specified unlock date or condition. However, gift givers can optionally 
                    set up emergency access conditions that would allow early access under certain circumstances, such as through a 
                    multi-signature approval process.
                  </p>
                </div>
              </div>
              
              <div className="border border-gray-800 rounded-lg overflow-hidden">
                <div className="bg-gray-900 px-6 py-4">
                  <h3 className="text-lg font-medium text-white">What happens if the recipient doesn't have a cryptocurrency wallet?</h3>
                </div>
                <div className="px-6 py-4 bg-gray-800/50">
                  <p className="text-gray-300">
                    Recipients will receive easy-to-follow instructions on how to set up a wallet when they're notified about their gift. 
                    Our system is designed to be user-friendly, even for those with no prior experience with cryptocurrency. We provide 
                    step-by-step guidance and support throughout the process.
                  </p>
                </div>
              </div>
              
              <div className="border border-gray-800 rounded-lg overflow-hidden">
                <div className="bg-gray-900 px-6 py-4">
                  <h3 className="text-lg font-medium text-white">Can I include multiple types of cryptocurrency in a single gift?</h3>
                </div>
                <div className="px-6 py-4 bg-gray-800/50">
                  <p className="text-gray-300">
                    Yes, you can create a gift basket with multiple cryptocurrencies. Our platform supports combining different assets 
                    into a single gift vault, allowing you to give a diversified crypto portfolio as a present.
                  </p>
                </div>
              </div>
              
              <div className="border border-gray-800 rounded-lg overflow-hidden">
                <div className="bg-gray-900 px-6 py-4">
                  <h3 className="text-lg font-medium text-white">What types of multimedia can I attach to my gift?</h3>
                </div>
                <div className="px-6 py-4 bg-gray-800/50">
                  <p className="text-gray-300">
                    You can attach various types of media to your gift, including:
                    <ul className="list-disc ml-6 mt-2">
                      <li>Text messages and letters</li>
                      <li>Photos and images</li>
                      <li>Video recordings</li>
                      <li>Audio messages</li>
                      <li>Digital artwork and NFTs</li>
                    </ul>
                    All multimedia content is securely encrypted and will only be accessible to the recipient when the gift unlocks.
                  </p>
                </div>
              </div>
              
              <div className="border border-gray-800 rounded-lg overflow-hidden">
                <div className="bg-gray-900 px-6 py-4">
                  <h3 className="text-lg font-medium text-white">Are there fees for creating a Gift Crypto Vault?</h3>
                </div>
                <div className="px-6 py-4 bg-gray-800/50">
                  <p className="text-gray-300">
                    Creating a Gift Crypto Vault includes a small service fee that covers the creation and maintenance of the vault, 
                    the secure storage of multimedia content, and the blockchain transaction costs. Fee details are clearly displayed 
                    before you finalize your gift. CVT token holders receive discounted fees based on their token holdings.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </DocumentationLayout>
    </>
  );
}