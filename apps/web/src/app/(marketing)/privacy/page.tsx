import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for the ArtisanConnect platform.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 border-x border-border max-w-5xl bg-card">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-3 pb-8 border-b border-border">
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wide">
            Privacy Policy
          </h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono">
            Last updated: October 2026
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            ArtisanConnect (&quot;ArtisanConnect&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to safeguarding your privacy and ensuring the responsible handling of your personal data. This Privacy Policy outlines our standards and practices regarding the collection, storage, processing, and protection of personal information across our marketplace platform, escrow payment infrastructure, and mobile-responsive web applications.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-wide mt-8">
            1. Introduction
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            This Privacy Policy applies to all individuals who register, access, or utilize the ArtisanConnect platform, including property owners or clients (&quot;Customers&quot;), skilled tradespeople and technicians (&quot;Artisans&quot;), and general visitors.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We process personal data in strict compliance with the Data Protection Act, 2012 (Act 843) of the Republic of Ghana, and applicable international privacy principles. By accessing or using the Platform, you acknowledge that you have read and understood this Privacy Policy and consent to the data collection and processing activities detailed herein.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-wide mt-8">
            2. Information We Collect
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            To provide reliable marketplace matchmaking, secure escrow processing, and identity verification, we collect several categories of information:
          </p>
          <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-4">
            <li><strong className="text-foreground">Personal Identification Information:</strong> Full legal name, email address, telephone contact number (including Mobile Money account numbers), residential or workshop address, and profile photographs.</li>
            <li><strong className="text-foreground">Identity Verification Documents:</strong> National Identification data (Republic of Ghana National ID / Ghana Card numbers and card images), live verification photos (selfies), vocational certifications, trade apprenticeships, and business registration certificates (for registered artisan enterprises).</li>
            <li><strong className="text-foreground">Location Data:</strong> Geolocation coordinates (GPS data) and approximate municipal or district location (e.g., Accra, Kumasi, Takoradi, Tema) collected with your permission to connect Customers with nearby verified Artisans.</li>
            <li><strong className="text-foreground">Service & Marketplace Records:</strong> Job descriptions, project scopes, diagnostic images, repair photographs, quotes, job progress milestones, messaging logs, customer ratings, and written reviews.</li>
            <li><strong className="text-foreground">Escrow & Financial Data:</strong> Mobile Money transaction reference IDs, bank payment confirmation tokens, escrow deposit logs, and disbursement records. Sensitive card numbers are handled via certified payment gateways and are never stored on our servers.</li>
            <li><strong className="text-foreground">Technical & Device Data:</strong> IP addresses, browser specifications, device identifiers, operating system details, access timestamps, and page interaction metrics.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-wide mt-8">
            3. How We Use Your Information
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We use the collected information for specific, legitimate, and lawful purposes:
          </p>
          <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-4">
            <li><strong className="text-foreground">Service Delivery & Matchmaking:</strong> Facilitating account creation, managing service requests, coordinating site visits, and connecting Customers with qualified local Artisans.</li>
            <li><strong className="text-foreground">Mandatory Identity Verification:</strong> Validating the authenticity of Artisan Ghana Cards, confirming workshop addresses, and awarding Verified Artisan Badges to maintain platform trust.</li>
            <li><strong className="text-foreground">AI-Powered Search & Matching:</strong> Processing service requests using semantic matching models to interpret natural language descriptions and recommend the best-suited Artisans based on trade skills, proximity, and past ratings.</li>
            <li><strong className="text-foreground">Escrow Payment Processing:</strong> Holding project funds securely during job execution and disbursing payouts upon mutual customer approval or milestone completion.</li>
            <li><strong className="text-foreground">Dispute Resolution & Fairness Scoring:</strong> Supplying job specifications, photographic evidence, and communication history to our AI fairness engine and administrative adjudicators to resolve claims equitably.</li>
            <li><strong className="text-foreground">Platform Safety & Fraud Prevention:</strong> Detecting fraudulent accounts, preventing off-platform fee evasion, and safeguarding infrastructure against abuse.</li>
            <li><strong className="text-foreground">Service Communications:</strong> Delivering booking confirmations, SMS job alerts, payment receipts, policy updates, and critical security notices.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-wide mt-8">
            4. Information Sharing
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We respect your privacy and only share your data under defined operational parameters:
          </p>
          <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-4">
            <li><strong className="text-foreground">Between Customers and Artisans:</strong> Once a service quote is accepted, we share relevant contact information, service address, and job specifications with the selected Artisan. Customers can view the Artisan&apos;s public profile, trade badges, ratings, and portfolio.</li>
            <li><strong className="text-foreground">Platform Administrators:</strong> Authorized ArtisanConnect support personnel and dispute mediators have access to communication logs, uploaded photos, and transaction records to adjudicate disputed escrow funds.</li>
            <li><strong className="text-foreground">Infrastructure & Processing Partners:</strong> We share data with trusted service providers necessary for platform operations, including Supabase (cloud database, auth, and secure storage) and licensed payment aggregators in Ghana (for Mobile Money and card transactions).</li>
            <li><strong className="text-foreground">No Sale of Personal Data:</strong> ArtisanConnect does NOT sell, lease, or barter your personal information to third-party advertisers, data brokers, or marketing networks.</li>
            <li><strong className="text-foreground">Legal & Regulatory Mandates:</strong> We may disclose information if required to comply with a judicial subpoena, lawful order from the Data Protection Commission, or formal inquiry from Ghanaian law enforcement agencies under Act 843.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-wide mt-8">
            5. Data Storage & Security
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We implement comprehensive technical, operational, and physical security measures to protect your personal data against unauthorized access, loss, alteration, or disclosure:
          </p>
          <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-4">
            <li><strong className="text-foreground">Cloud Infrastructure:</strong> All platform data is housed in enterprise-grade cloud databases hosted through Supabase, featuring high availability and automated continuous backups.</li>
            <li><strong className="text-foreground">Encryption Standards:</strong> Data in transit is protected using TLS 1.3 encryption. Data at rest, including identification records and verification photos, is secured using AES-256 encryption.</li>
            <li><strong className="text-foreground">Database Row Level Security (RLS):</strong> We enforce granular Row Level Security policies directly at the database layer, ensuring users can only read and write data that belongs to their verified session.</li>
            <li><strong className="text-foreground">Data Retention:</strong> We retain personal information for the period necessary to fulfill service agreements, resolve disputes, and comply with statutory financial record-keeping obligations under Ghanaian law (typically 6 years for financial escrow records).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-wide mt-8">
            6. Cookies & Tracking Technologies
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            ArtisanConnect employs minimal, privacy-centric cookies and browser storage mechanisms. We use strictly necessary cookies to manage authentication sessions via Supabase and protect against Cross-Site Request Forgery (CSRF). We also use functional storage keys to remember your theme preference (dark/light) and cookie banner status.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We do not deploy third-party advertising cookies, social media tracking pixels, or cross-site behavioral monitors. For detailed information regarding our cookie practices, please review our dedicated Cookie Policy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-wide mt-8">
            7. Your Rights
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Under the Data Protection Act, 2012 (Act 843) of the Republic of Ghana, you possess distinct legal rights regarding your personal data:
          </p>
          <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-4">
            <li><strong className="text-foreground">Right of Access:</strong> You have the right to request a copy of the personal information ArtisanConnect holds about you.</li>
            <li><strong className="text-foreground">Right to Rectification:</strong> You may request the correction or update of inaccurate, incomplete, or outdated personal information.</li>
            <li><strong className="text-foreground">Right to Deletion (Erasure):</strong> You may request the removal of your personal information when it is no longer required for platform operations, subject to statutory retention laws.</li>
            <li><strong className="text-foreground">Right to Object:</strong> You may object to the processing of your data on grounds relating to your particular situation, where processing is based on legitimate interests.</li>
            <li><strong className="text-foreground">Right to Data Portability:</strong> You have the right to obtain your personal information in a structured, commonly used electronic format.</li>
            <li><strong className="text-foreground">Right to Lodge a Complaint:</strong> You have the right to submit a complaint directly to the Data Protection Commission (DPC) of Ghana if you believe your statutory data rights have been violated.</li>
          </ul>
          <p className="text-muted-foreground text-sm leading-relaxed">
            To exercise any of these rights, please email our Data Protection Team at <span className="text-foreground font-medium">privacy@artisanconnect.com</span>. We will respond to your request within the statutory timeframe prescribed under Act 843.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-wide mt-8">
            8. Children&apos;s Privacy
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The ArtisanConnect platform is intended exclusively for individuals aged 18 years and above. We do not knowingly solicit or collect personal information from children or minors. If we discover that an account has been registered by an individual under the age of 18, we will take immediate steps to terminate the account and purge all associated personal data from our systems.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-wide mt-8">
            9. Changes to This Policy
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            ArtisanConnect may periodically update this Privacy Policy to reflect technical enhancements, operational modifications, or changes in statutory data protection laws in Ghana.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            When modifications occur, we will revise the &quot;Last updated&quot; date at the top of this document. In the event of material modifications that significantly affect your privacy rights, we will provide prominent notice through platform alerts or direct email communication prior to the changes taking effect.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-wide mt-8">
            10. Contact Us
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            If you have questions, feedback, or requests regarding this Privacy Policy or our data protection protocols, please reach out to our Data Protection Officer:
          </p>
          <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-4">
            <li><strong className="text-foreground">Data Protection Officer:</strong> privacy@artisanconnect.com</li>
            <li><strong className="text-foreground">General Support:</strong> support@artisanconnect.com</li>
            <li><strong className="text-foreground">Regulatory Jurisdiction:</strong> Data Protection Commission, Republic of Ghana</li>
            <li><strong className="text-foreground">Physical Office:</strong> Accra, Greater Accra Region, Republic of Ghana</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
