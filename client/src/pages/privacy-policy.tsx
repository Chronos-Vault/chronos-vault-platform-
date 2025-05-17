import React from 'react';
import { Layout } from '@/components/layout';
import { PageHeader } from '@/components/page-header';
import { Shield, Lock, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const PrivacyPolicyPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <PageHeader
          heading="Privacy Policy" 
          description="How we protect and manage your data at Chronos Vault"
          separator
        />
        
        <div className="max-w-4xl mx-auto mt-8">
          <div className="text-gray-300 space-y-8">
            <section>
              <Card className="bg-black/50 border border-[#6B00D7]/20">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <Shield className="h-5 w-5 text-[#6B00D7] mr-2" />
                    <h2 className="text-2xl font-bold text-white">Our Commitment to Privacy</h2>
                  </div>
                  <p className="mb-4">
                    At Chronos Vault, we are committed to maintaining the privacy and security of your data. As a platform built on blockchain technology
                    and zero-knowledge proofs, privacy is at the core of our mission. This privacy policy explains how we collect, use, and protect your data
                    when you use our services.
                  </p>
                  <p>
                    Last Updated: May 17, 2025
                  </p>
                </CardContent>
              </Card>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
              <p className="mb-4">
                We collect the following types of information when you use Chronos Vault:
              </p>
              
              <div className="space-y-4 pl-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Account Information</h3>
                  <p>
                    To provide you with our services, we collect your wallet address, email address (if provided), and account preferences.
                    This information is used to identify you within our system and provide access to your vaults.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Blockchain Transaction Data</h3>
                  <p>
                    When you interact with our smart contracts or perform transactions, this data is recorded on the respective blockchain
                    (Ethereum, TON, Solana, or Bitcoin). This information is publicly visible on the blockchain but is not personally identifiable
                    unless correlated with your wallet address.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Vault Metadata</h3>
                  <p>
                    We store metadata related to your vaults, including names, descriptions, security settings, and time lock parameters.
                    Actual vault contents (assets, encryption keys, etc.) are stored on the blockchain and/or encrypted with your keys.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Usage Data</h3>
                  <p>
                    We collect information about how you use our platform, including feature usage, error logs, and performance metrics.
                    This helps us improve our services and troubleshoot issues.
                  </p>
                </div>
              </div>
            </section>
            
            <Separator className="bg-[#6B00D7]/20" />
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
              <div className="space-y-4 pl-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Providing Services</h3>
                  <p>
                    We use your information to provide, maintain, and improve our vault services, including
                    creating and managing time-locked vaults, processing transactions, and enforcing security measures.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Security</h3>
                  <p>
                    We use data to secure your account, detect and prevent fraud, enforce multi-signature requirements,
                    and maintain the security of our platform.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Communication</h3>
                  <p>
                    We may use your contact information to send you important updates about your vaults, security alerts,
                    and platform announcements. You can opt out of non-essential communications.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Analytics</h3>
                  <p>
                    We analyze usage patterns to improve our platform, develop new features, and enhance user experience.
                    This data is aggregated and anonymized whenever possible.
                  </p>
                </div>
              </div>
            </section>
            
            <Separator className="bg-[#6B00D7]/20" />
            
            <section>
              <div className="flex items-center mb-4">
                <Lock className="h-5 w-5 text-[#6B00D7] mr-2" />
                <h2 className="text-2xl font-bold text-white">Data Security</h2>
              </div>
              
              <p className="mb-4">
                Security is at the core of Chronos Vault. We implement the following measures to protect your data:
              </p>
              
              <div className="space-y-4 pl-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Zero-Knowledge Architecture</h3>
                  <p>
                    Our platform uses zero-knowledge cryptography, allowing you to prove ownership or meet criteria
                    without revealing underlying data. Your actual vault contents remain private.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Blockchain Security</h3>
                  <p>
                    Our multi-chain architecture distributes security across multiple blockchains, providing
                    redundancy and increasing resistance to attacks.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Encryption</h3>
                  <p>
                    Sensitive data is encrypted using advanced encryption standards. Private keys for encryption
                    are never transmitted to our servers in unencrypted form.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Continuous Monitoring</h3>
                  <p>
                    We maintain security systems that continuously monitor for unauthorized access attempts,
                    suspicious activities, or potential vulnerabilities.
                  </p>
                </div>
              </div>
            </section>
            
            <Separator className="bg-[#6B00D7]/20" />
            
            <section>
              <div className="flex items-center mb-4">
                <Eye className="h-5 w-5 text-[#6B00D7] mr-2" />
                <h2 className="text-2xl font-bold text-white">Your Privacy Rights</h2>
              </div>
              
              <p className="mb-4">
                Depending on your location, you may have certain rights regarding your personal data:
              </p>
              
              <div className="space-y-4 pl-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Access and Portability</h3>
                  <p>
                    You can request copies of your personal data in a structured, commonly used format.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Correction</h3>
                  <p>
                    You can request that we correct inaccurate or incomplete information about you.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Deletion</h3>
                  <p>
                    You can request deletion of your account and associated data, subject to certain exceptions
                    like regulatory requirements or legitimate business purposes.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Objection</h3>
                  <p>
                    You can object to our processing of your personal data under certain circumstances.
                  </p>
                </div>
              </div>
              
              <p className="mt-4">
                To exercise these rights, please contact our privacy team at chronosvault@chronosvault.org.
              </p>
            </section>
            
            <Separator className="bg-[#6B00D7]/20" />
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Changes to this Policy</h2>
              <p>
                We may update this privacy policy from time to time to reflect changes in our practices or legal
                requirements. We will notify you of any material changes by posting the new policy on this page
                and updating the "Last Updated" date.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our data practices, please contact us at:
                chronosvault@chronosvault.org
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicyPage;