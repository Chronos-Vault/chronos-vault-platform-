import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Check, Shield, Clock, Image, Video, MessageSquare, Calendar } from "lucide-react";

const MemoryVaultPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="mb-12">
        <Link to="/vault-school">
          <Button variant="ghost" className="mb-6 hover:bg-[#6B00D7]/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vault School
          </Button>
        </Link>

        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center shadow-lg shadow-[#6B00D7]/30 mr-4">
            <Clock className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
            Time-Lock Memory Vault
          </h1>
        </div>
        
        <p className="text-xl text-gray-300 max-w-3xl mb-6">
          A specialized vault that combines digital assets with multimedia memories, creating a unique time capsule that unlocks at a predefined date.
        </p>

        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 max-w-3xl">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Shield className="mr-2 h-5 w-5 text-[#FF5AF7]" /> Key Benefits
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Store digital assets alongside photos, videos, and personal messages</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Time-lock all content until a specific future date or event</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Secure decentralized storage for precious memories and messages</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Create meaningful gifts for loved ones or future generations</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Combine emotional value with financial assets in a single vault</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Technical Overview Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#333] pb-2">
          Technical Overview
        </h2>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300">
            The Time-Lock Memory Vault extends our standard vault architecture with specialized 
            storage capabilities for multimedia content. It combines secure asset management with 
            encrypted decentralized storage for photos, videos, and personal messages.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3 text-white">Key Technologies</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#242424] border border-[#333] rounded-lg p-5">
              <div className="flex items-center mb-3">
                <Image className="h-5 w-5 text-[#FF5AF7] mr-3" />
                <h4 className="text-lg font-medium text-white">Decentralized Media Storage</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Photos, videos, and other media are securely stored using a combination of 
                decentralized storage solutions including Arweave for permanent storage. 
                All content is encrypted before upload, ensuring privacy and security.
              </p>
            </div>
            
            <div className="bg-[#242424] border border-[#333] rounded-lg p-5">
              <div className="flex items-center mb-3">
                <Clock className="h-5 w-5 text-[#FF5AF7] mr-3" />
                <h4 className="text-lg font-medium text-white">Time-Lock Encryption</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Media content and messages are encrypted with time-lock encryption that mathematically 
                prevents decryption until a specific date or condition is met. This uses advanced 
                cryptographic techniques including verifiable delay functions.
              </p>
            </div>
            
            <div className="bg-[#242424] border border-[#333] rounded-lg p-5">
              <div className="flex items-center mb-3">
                <MessageSquare className="h-5 w-5 text-[#FF5AF7] mr-3" />
                <h4 className="text-lg font-medium text-white">Message Preservation</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Text messages are preserved with future-proof encoding and formatting to ensure 
                they remain readable regardless of technology changes. Messages are stored both 
                on-chain and in decentralized storage systems for redundancy.
              </p>
            </div>
            
            <div className="bg-[#242424] border border-[#333] rounded-lg p-5">
              <div className="flex items-center mb-3">
                <Calendar className="h-5 w-5 text-[#FF5AF7] mr-3" />
                <h4 className="text-lg font-medium text-white">Flexible Unlocking Conditions</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Beyond simple calendar dates, vaults can be configured to unlock based on specific 
                events including blockchain milestones (like Bitcoin halving), age-based conditions, 
                or multi-factor authentication from designated trusted parties.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#333] pb-2">
          How It Works
        </h2>
        
        <div className="space-y-6 mb-8">
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">1. Memory Vault Creation</h3>
            <p className="text-gray-300 mb-4">
              Creating a Time-Lock Memory Vault involves:
            </p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Selecting the primary digital assets for the vault (cryptocurrency, NFTs, etc.)</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Choosing the unlock date or condition for the vault</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Uploading photos, videos, or other media content</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Composing personal messages to accompany the assets</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Selecting beneficiaries who will receive access when the vault unlocks</span>
              </li>
            </ul>
            <p className="text-gray-300">
              Upon creation, the Memory Vault generates a unique encryption key for the media content, 
              which is itself encrypted with time-lock encryption mechanisms.
            </p>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">2. Media Storage Architecture</h3>
            <p className="text-gray-300 mb-4">
              All multimedia content follows a sophisticated storage process:
            </p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Content is first encrypted on the client side with AES-256 encryption</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Primary storage uses Arweave's permanent decentralized network</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Backup copies are stored on alternative networks for redundancy</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Media metadata (but not content) is stored on-chain for integrity verification</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>File integrity is regularly verified through cryptographic proofs</span>
              </li>
            </ul>
            <p className="text-gray-300">
              This multi-layered storage approach ensures that media content remains intact and 
              available when the vault unlocks, even decades in the future.
            </p>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">3. Time-Lock Implementation</h3>
            <p className="text-gray-300 mb-4">
              The time-lock mechanism is implemented through multiple layers:
            </p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Primary enforcement through smart contracts that prevent access until the set date</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Cryptographic time-lock encryption for media content and messages</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Cross-chain verification of time conditions for additional security</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Optional trusted-party verification for additional security</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Immutable unlocking conditions that cannot be modified after creation</span>
              </li>
            </ul>
            <p className="text-gray-300">
              This comprehensive time-lock system ensures that the vault's contents remain 
              securely locked until the exact predetermined time or condition is met.
            </p>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">4. Vault Unlocking Process</h3>
            <p className="text-gray-300 mb-4">
              When the unlock date arrives:
            </p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Beneficiaries receive notification that the vault is now accessible</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Decryption keys for media content are automatically released by the smart contract</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Assets are made available for transfer through the vault interface</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Multimedia content becomes viewable in a special memory gallery interface</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Personal messages are revealed with original formatting and presentation</span>
              </li>
            </ul>
            <p className="text-gray-300">
              The unlocking process creates a unique experience where digital assets and meaningful 
              personal content are revealed simultaneously, creating a powerful emotional moment.
            </p>
          </div>
        </div>
      </div>

      {/* Memory Gallery Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#333] pb-2">
          Memory Gallery Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mr-4">
                <Image className="h-5 w-5 text-[#FF5AF7]" />
              </div>
              <h3 className="text-lg font-semibold text-white">Photo Collection</h3>
            </div>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Support for high-resolution images (up to 50MB per photo)</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Preservation of metadata including location, date, and camera information</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Ability to organize photos into themed collections or timelines</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Optional captions and descriptions for each image</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Format future-proofing to ensure viewability decades into the future</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mr-4">
                <Video className="h-5 w-5 text-[#FF5AF7]" />
              </div>
              <h3 className="text-lg font-semibold text-white">Video Archive</h3>
            </div>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Storage for HD video content (up to 500MB per video)</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Support for multiple video formats with automatic transcoding</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Video preview thumbnails and chapter markers</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Audio track preservation with multi-language support</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Decentralized video storage with multiple redundancy layers</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mr-4">
                <MessageSquare className="h-5 w-5 text-[#FF5AF7]" />
              </div>
              <h3 className="text-lg font-semibold text-white">Personal Messages</h3>
            </div>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Rich text editor with formatting, embedded images, and links</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Voice message recordings with transcription</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Scheduled sequential message reveals (one per day, week, etc.)</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Custom themes and presentation styles for messages</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Interactive elements like quizzes, games, or treasure hunts</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mr-4">
                <Calendar className="h-5 w-5 text-[#FF5AF7]" />
              </div>
              <h3 className="text-lg font-semibold text-white">Timeline & Presentation</h3>
            </div>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Chronological organization of all content with interactive timeline</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Immersive slideshow presentation mode with music</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Customizable themes for visual presentation</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Downloadable archive of all content for local storage</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Shareable links for specific items (with permissions controls)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#333] pb-2">
          Ideal Use Cases
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Family Legacy</h3>
            <p className="text-gray-300 text-sm">
              Create a time capsule for children or grandchildren with family photos, videos, 
              personal messages, and financial assets that unlocks when they reach a certain age.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Milestone Celebrations</h3>
            <p className="text-gray-300 text-sm">
              Create a special gift that unlocks on a significant future date like a 
              25th wedding anniversary, graduation, or other important milestone.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Future Messages</h3>
            <p className="text-gray-300 text-sm">
              Send messages to your future self or loved ones, paired with investment assets 
              that grow over time until the unlock date arrives.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Memorial Planning</h3>
            <p className="text-gray-300 text-sm">
              Create a personal memorial with videos, photos, and messages to be shared 
              with loved ones after your passing, along with digital asset inheritance.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Historical Documentation</h3>
            <p className="text-gray-300 text-sm">
              Document current events, personal experiences, or family history to be 
              preserved and revealed at a future date for educational or historical purposes.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Surprise Gifting</h3>
            <p className="text-gray-300 text-sm">
              Create time-locked surprise gifts with personal messages and assets that 
              reveal themselves on birthdays, holidays, or other special occasions.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <Link to="/vault-types-selector">
          <Button className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white px-8 py-6 h-auto text-lg rounded-xl shadow-lg shadow-[#6B00D7]/30 transition-all hover:shadow-xl hover:shadow-[#6B00D7]/40">
            Create Memory Vault
          </Button>
        </Link>
        <p className="text-gray-400 mt-4">
          Combine your digital assets with treasured memories in a time-locked vault
        </p>
      </div>
    </div>
  );
};

export default MemoryVaultPage;