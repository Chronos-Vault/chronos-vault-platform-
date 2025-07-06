import React from 'react';
import { Layout } from '@/components/layout';
import { PageHeader } from '@/components/page-header';
import { FileText, Scale, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const TermsOfServicePage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <PageHeader
          heading="Terms of Service" 
          description="The rules and guidelines governing your use of Chronos Vault"
          separator
        />
        
        <div className="max-w-4xl mx-auto mt-8">
          <div className="text-gray-300 space-y-8">
            <section>
              <Card className="bg-black/50 border border-[#6B00D7]/20">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <FileText className="h-5 w-5 text-[#6B00D7] mr-2" />
                    <h2 className="text-2xl font-bold text-white">Terms of Service Agreement</h2>
                  </div>
                  <p className="mb-4">
                    Welcome to Chronos Vault. These Terms of Service ("Terms") govern your access to and use of the Chronos Vault platform, 
                    including our website, mobile applications, smart contracts, and blockchain services (collectively, the "Service").
                  </p>
                  <p className="mb-4">
                    Please read these Terms carefully. By accessing or using the Service, you agree to be bound by these Terms and our 
                    Privacy Policy. If you do not agree to these Terms, you may not access or use the Service.
                  </p>
                  <p>
                    Last Updated: May 17, 2025
                  </p>
                </CardContent>
              </Card>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Service Description</h2>
              <p className="mb-4">
                Chronos Vault is a multi-blockchain platform that enables users to create and manage various types of digital vaults
                for securing and time-locking assets across different blockchain networks, including Ethereum, TON, Solana, and Bitcoin.
              </p>
              <p>
                Our services include, but are not limited to, creation and management of time-locked vaults, 
                multi-signature security features, geolocation-based access controls, 
                investment discipline mechanisms, cross-chain verification, and secure storage solutions.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Eligibility and Account Registration</h2>
              <div className="space-y-4 pl-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">2.1 Eligibility</h3>
                  <p>
                    You must be at least 18 years old to use the Service. By accessing or using the Service, you represent and warrant 
                    that you are at least 18 years old and have the legal capacity to enter into these Terms.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">2.2 Account Creation</h3>
                  <p>
                    To use certain features of the Service, you must connect a compatible blockchain wallet. You are responsible for 
                    maintaining the security of your wallet and any connected accounts. You agree to provide accurate information when 
                    registering for the Service.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">2.3 Account Security</h3>
                  <p>
                    You are solely responsible for maintaining the confidentiality of your wallet's private keys and any other 
                    authentication credentials. You agree to immediately notify us of any unauthorized use of your account or any 
                    other breach of security.
                  </p>
                </div>
              </div>
            </section>
            
            <Separator className="bg-[#6B00D7]/20" />
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. User Obligations</h2>
              <div className="space-y-4 pl-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">3.1 Compliance with Laws</h3>
                  <p>
                    You agree to use the Service in compliance with all applicable laws, regulations, and these Terms. 
                    You are solely responsible for ensuring that your use of the Service, including all transactions, 
                    vault creations, and asset management, complies with the laws of your jurisdiction.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">3.2 Prohibited Activities</h3>
                  <p className="mb-2">
                    You agree not to engage in any of the following prohibited activities:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Using the Service for any illegal purpose or in violation of any laws;</li>
                    <li>Infringing upon the intellectual property rights of others;</li>
                    <li>Attempting to interfere with, compromise, or disrupt the Service or servers;</li>
                    <li>Using the Service to store, transfer, or manage assets derived from illegal activities;</li>
                    <li>Attempting to bypass or circumvent any security features of the Service;</li>
                    <li>Using the Service to engage in price manipulation, fraud, or deceptive practices;</li>
                    <li>Harassing, threatening, or intimidating other users;</li>
                    <li>Creating or distributing malware or other harmful code;</li>
                    <li>Engaging in any activity that imposes an unreasonable load on our infrastructure.</li>
                  </ul>
                </div>
              </div>
            </section>
            
            <Separator className="bg-[#6B00D7]/20" />
            
            <section>
              <div className="flex items-center mb-4">
                <Scale className="h-5 w-5 text-[#6B00D7] mr-2" />
                <h2 className="text-2xl font-bold text-white">4. Intellectual Property Rights</h2>
              </div>
              
              <div className="space-y-4 pl-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">4.1 Our Intellectual Property</h3>
                  <p>
                    The Service, including its content, features, functionality, and visual interfaces, is owned by 
                    Chronos Vault and is protected by copyright, trademark, and other intellectual property laws. 
                    These Terms do not grant you any right, title, or interest in the Service, our trademarks, 
                    logos, or other proprietary materials.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">4.2 Feedback</h3>
                  <p>
                    Any feedback, suggestions, ideas, or other information you provide about the Service ("Feedback") 
                    may be used by us without any obligation to compensate you. You grant us a non-exclusive, 
                    royalty-free, perpetual, irrevocable license to use such Feedback for any purpose.
                  </p>
                </div>
              </div>
            </section>
            
            <Separator className="bg-[#6B00D7]/20" />
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Blockchain Transactions and Fees</h2>
              <div className="space-y-4 pl-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">5.1 Blockchain Transactions</h3>
                  <p>
                    When you use our Service to create vaults, transfer assets, or perform other actions on the blockchain, 
                    you are initiating blockchain transactions. These transactions are irreversible and subject to the rules 
                    of the respective blockchain networks. We cannot reverse, cancel, or refund blockchain transactions once 
                    they have been confirmed on the network.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">5.2 Network Fees</h3>
                  <p>
                    All blockchain transactions require network fees (such as gas fees on Ethereum) to be processed. 
                    These fees are paid directly to the network validators and miners, not to Chronos Vault. You are 
                    responsible for paying these network fees for any transactions you initiate through our Service.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">5.3 Service Fees</h3>
                  <p>
                    Chronos Vault may charge service fees for specific features or operations. These fees will be 
                    clearly disclosed before you complete the transaction. By using these features, you agree to 
                    pay the associated fees.
                  </p>
                </div>
              </div>
            </section>
            
            <Separator className="bg-[#6B00D7]/20" />
            
            <section>
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-5 w-5 text-[#6B00D7] mr-2" />
                <h2 className="text-2xl font-bold text-white">6. Disclaimers and Limitations of Liability</h2>
              </div>
              
              <div className="space-y-4 pl-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">6.1 Service Provided "As Is"</h3>
                  <p>
                    THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, 
                    EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, 
                    FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">6.2 No Guarantees</h3>
                  <p>
                    We do not guarantee that the Service will be uninterrupted, secure, or error-free. We do not guarantee 
                    that the results obtained from using the Service will be accurate or reliable. We are not responsible 
                    for any losses or damages that may result from blockchain network failures, wallet vulnerabilities, 
                    user errors, or malicious activities by third parties.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">6.3 Limitation of Liability</h3>
                  <p>
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL CHRONOS VAULT, ITS AFFILIATES, DIRECTORS, 
                    EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL DAMAGES, 
                    OR ANY DAMAGES WHATSOEVER INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF USE, DATA, OR PROFITS, 
                    ARISING OUT OF OR IN ANY WAY CONNECTED WITH THE USE OR PERFORMANCE OF THE SERVICE.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">6.4 Risk Acknowledgment</h3>
                  <p>
                    You acknowledge that using blockchain technology and cryptocurrencies involves significant risks, 
                    including but not limited to, price volatility, regulatory uncertainty, technical vulnerabilities, 
                    and the potential for permanent loss of assets. You accept and assume all such risks when using our Service.
                  </p>
                </div>
              </div>
            </section>
            
            <Separator className="bg-[#6B00D7]/20" />
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Changes to Terms</h2>
              <p>
                We may modify these Terms at any time. We will notify you of any material changes by posting the new Terms 
                on this page and updating the "Last Updated" date. Your continued use of the Service after any such changes 
                constitutes your acceptance of the new Terms.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at: chronosvault@chronosvault.org
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfServicePage;