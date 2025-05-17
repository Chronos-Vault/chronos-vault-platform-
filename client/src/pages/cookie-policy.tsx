import React from 'react';
import { Layout } from '@/components/layout';
import { PageHeader } from '@/components/page-header';
import { Cookie, Info, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const CookiePolicyPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <PageHeader
          heading="Cookie Policy" 
          description="How Chronos Vault uses cookies and similar technologies"
          separator
        />
        
        <div className="max-w-4xl mx-auto mt-8">
          <div className="text-gray-300 space-y-8">
            <section>
              <Card className="bg-black/50 border border-[#6B00D7]/20">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <Cookie className="h-5 w-5 text-[#6B00D7] mr-2" />
                    <h2 className="text-2xl font-bold text-white">Cookie Policy</h2>
                  </div>
                  <p className="mb-4">
                    This Cookie Policy explains how Chronos Vault ("we", "us", or "our") uses cookies and similar technologies 
                    to recognize and remember you when you visit our website and use our services. It explains what these technologies are 
                    and why we use them, as well as your rights to control our use of them.
                  </p>
                  <p>
                    Last Updated: May 17, 2025
                  </p>
                </CardContent>
              </Card>
            </section>
            
            <section>
              <div className="flex items-center mb-4">
                <Info className="h-5 w-5 text-[#6B00D7] mr-2" />
                <h2 className="text-2xl font-bold text-white">What Are Cookies?</h2>
              </div>
              <p className="mb-4">
                Cookies are small data files that are placed on your computer or mobile device when you visit a website. 
                Cookies are widely used by website owners to make their websites work, or to work more efficiently, 
                as well as to provide reporting information.
              </p>
              <p>
                Cookies set by the website owner (in this case, Chronos Vault) are called "first-party cookies". 
                Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies 
                enable third-party features or functionality to be provided on or through the website (such as analytics, 
                interactive content, and advertising). The parties that set these third-party cookies can recognize your 
                computer both when it visits the website in question and also when it visits certain other websites.
              </p>
            </section>
            
            <Separator className="bg-[#6B00D7]/20" />
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Types of Cookies We Use</h2>
              <div className="space-y-4 pl-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Essential Cookies</h3>
                  <p>
                    These cookies are strictly necessary to provide you with services available through our website 
                    and to use some of its features, such as access to secure areas. Because these cookies are 
                    strictly necessary to deliver the website, you cannot refuse them without impacting how our 
                    website functions.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Performance/Analytics Cookies</h3>
                  <p>
                    These cookies collect information about how visitors use our website, for instance which pages 
                    visitors go to most often, and if they get error messages from web pages. These cookies don't 
                    collect information that identifies a visitor. All information these cookies collect is aggregated 
                    and therefore anonymous. It is only used to improve how our website works.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Functionality Cookies</h3>
                  <p>
                    These cookies allow our website to remember choices you make (such as your preferred language or 
                    the region you are in) and provide enhanced, more personal features. These cookies can also be 
                    used to remember changes you have made to text size, fonts, and other parts of web pages that 
                    you can customize.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Blockchain Wallet Connection</h3>
                  <p>
                    When you connect your blockchain wallet to our platform, we store connection information to 
                    maintain your session and provide a seamless experience across our services. This information 
                    is stored locally on your device and is essential for the functioning of our blockchain-based services.
                  </p>
                </div>
              </div>
            </section>
            
            <Separator className="bg-[#6B00D7]/20" />
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">How We Use Cookies</h2>
              <p className="mb-4">
                We use cookies for several purposes, including:
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>To enable certain functions of the Service</li>
                <li>To provide analytics and understand how you use our website</li>
                <li>To store your preferences</li>
                <li>To facilitate secure blockchain wallet connections</li>
                <li>To maintain active sessions and authentication status</li>
                <li>To optimize your user experience across devices</li>
                <li>To prevent fraud and enhance security</li>
              </ul>
            </section>
            
            <Separator className="bg-[#6B00D7]/20" />
            
            <section>
              <div className="flex items-center mb-4">
                <Settings className="h-5 w-5 text-[#6B00D7] mr-2" />
                <h2 className="text-2xl font-bold text-white">Your Choices Regarding Cookies</h2>
              </div>
              
              <p className="mb-4">
                If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, 
                please visit the help pages of your web browser.
              </p>
              
              <p className="mb-4">
                Please note, however, that if you delete cookies or refuse to accept them, you might not 
                be able to use all of the features we offer, you may not be able to store your preferences, 
                and some of our pages might not display properly.
              </p>
              
              <div className="space-y-4 pl-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Browser Cookie Controls</h3>
                  <p>
                    Most browsers allow you to control cookies through their settings, which may be found in the 
                    browser's "Tools" or "Preferences" menu. Here are links to instructions for some common browsers:
                  </p>
                  
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>
                      <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-[#6B00D7] hover:underline">
                        Google Chrome
                      </a>
                    </li>
                    <li>
                      <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-[#6B00D7] hover:underline">
                        Mozilla Firefox
                      </a>
                    </li>
                    <li>
                      <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-[#6B00D7] hover:underline">
                        Safari
                      </a>
                    </li>
                    <li>
                      <a href="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd" target="_blank" rel="noopener noreferrer" className="text-[#6B00D7] hover:underline">
                        Microsoft Edge
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
            
            <Separator className="bg-[#6B00D7]/20" />
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Local Storage and Similar Technologies</h2>
              <p className="mb-4">
                In addition to cookies, we also use other similar technologies such as web beacons and local storage to 
                enhance your experience with our platform:
              </p>
              
              <div className="space-y-4 pl-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Local Storage</h3>
                  <p>
                    We use local storage (including localStorage and sessionStorage) to store blockchain wallet connection 
                    information, user preferences, and temporary session data. Unlike cookies, local storage data is not 
                    automatically transmitted to the server with each request, but it can be accessed by JavaScript on the same domain.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Web Beacons</h3>
                  <p>
                    We may use web beacons (small graphic images) in emails and on our site to track engagement and platform 
                    performance. These allow us to understand when emails have been opened and interacted with, helping us measure 
                    the effectiveness of our communications.
                  </p>
                </div>
              </div>
            </section>
            
            <Separator className="bg-[#6B00D7]/20" />
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Updates to this Cookie Policy</h2>
              <p>
                We may update this Cookie Policy from time to time in order to reflect changes to the cookies and related 
                technologies we use or for other operational, legal, or regulatory reasons. Please therefore re-visit this 
                Cookie Policy regularly to stay informed about our use of cookies and related technologies.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p>
                If you have any questions about our use of cookies or other technologies, please email us at: 
                privacy@chronosvault.io
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CookiePolicyPage;