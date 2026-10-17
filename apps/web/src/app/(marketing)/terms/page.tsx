import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for using the ArtisanConnect platform.',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 border-x border-border max-w-5xl bg-card">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-3 pb-8 border-b border-border">
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wide">
            Terms of Service
          </h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono">
            Last updated: October 2026
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;User&quot;, &quot;Customer&quot;, or &quot;Artisan&quot;) and ArtisanConnect (&quot;ArtisanConnect&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). Please read these Terms thoroughly before using our marketplace platform, escrow payment infrastructure, dispute resolution mechanism, or associated services.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-wide mt-8">
            1. Acceptance of Terms
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            By creating an account, accessing, or utilizing the ArtisanConnect platform (the &quot;Platform&quot;), you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service, along with our Privacy Policy and Cookie Policy. If you do not unconditionally accept these Terms in their entirety, you are strictly prohibited from accessing or using the Platform.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We reserve the right to amend, update, or revise these Terms at any time. Continued access to or utilization of the Platform following any modifications constitutes full acceptance of the revised Terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-wide mt-8">
            2. Description of Service
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            ArtisanConnect operates an online marketplace infrastructure designed to connect domestic and commercial clients (&quot;Customers&quot;) with vetted, skilled tradespeople and technicians (&quot;Artisans&quot;) across the Republic of Ghana. Trade categories include, but are not limited to, plumbing, electrical installations, carpentry, masonry, painting, welding, automotive mechanics, and general structural maintenance.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The Platform provides discovery tools, geolocation-based matching, AI-powered semantic search, identity verification, quotation workflows, secure escrow payment management, messaging, and dispute resolution mechanisms.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            ArtisanConnect acts strictly as a neutral technology platform facilitating introductions and contract execution between independent parties. ArtisanConnect is not an employer, general contractor, joint venturer, or guarantor of any Artisan. Artisans are independent service providers solely responsible for their labor, trade equipment, safety precautions, licensing, and compliance with Ghanaian statutory requirements.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-wide mt-8">
            3. User Accounts & Registration
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            To access certain core features, you must register for an account as either a Customer or an Artisan. You agree to provide accurate, current, and complete information during registration and maintain updated profile details at all times.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            <strong className="text-foreground">Identity Verification Requirement:</strong> To maintain safety, reliability, and institutional trust on the Platform, all Artisans are required to undergo mandatory identity and credential verification before receiving service requests or submitting quotes. Verification requirements include:
          </p>
          <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-4">
            <li>Submission of a valid Republic of Ghana National Identification Card (Ghana Card).</li>
            <li>Verification of active Mobile Money registered phone number and physical workshop or residential address.</li>
            <li>Proof of vocational qualifications, trade association membership, or vetted portfolio documentation where applicable.</li>
          </ul>
          <p className="text-muted-foreground text-sm leading-relaxed">
            You are responsible for maintaining the confidentiality of your authentication credentials and account tokens. You agree to immediately notify ArtisanConnect of any unauthorized access, compromise, or breach of security. ArtisanConnect shall not be liable for losses resulting from unauthorized account usage.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-wide mt-8">
            4. Service Requests & Quotes
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Customers may publish service requests specifying the nature of the required task, physical location, timeline, and accompanying diagnostic media. Artisans may review requirements and submit itemized quotes specifying labor fees, materials estimates, and project durations.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Upon acceptance of a quote by the Customer and deposition of the required funds into platform escrow, a binding bilateral service agreement is created between the Customer and the Artisan. Any change in scope, additional material procurement, or schedule modifications must be documented and processed through the Platform.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Customers agree to provide reasonable and secure physical access to job premises. Artisans agree to execute agreed works with professional diligence, quality craftsmanship, and adherence to relevant safety standards.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-wide mt-8">
            5. Escrow Payment Terms
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            ArtisanConnect mandates the use of an escrow payment system to safeguard financial transactions for all platform bookings. Payments are supported through authorized Ghanaian payment channels including Mobile Money (MTN MoMo, Telecel Cash, AT Money) and debit/credit cards.
          </p>
          <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-4">
            <li><strong className="text-foreground">Mandatory Escrow Deposit:</strong> Prior to the commencement of any physical work, the Customer must deposit the full agreed contract sum into the secure ArtisanConnect escrow account.</li>
            <li><strong className="text-foreground">Holding of Funds:</strong> Escrowed funds are held securely by ArtisanConnect or its licensed payment custody partners and are not accessible to either party while work is in progress.</li>
            <li><strong className="text-foreground">Release of Payment:</strong> Upon completion of the job, the Artisan marks the assignment as complete. The Customer has a designated review window to inspect the deliverables and confirm satisfaction. Once approved by the Customer, funds are released to the Artisan minus applicable platform service commissions.</li>
            <li><strong className="text-foreground">Automatic Dispute Freeze:</strong> If a formal dispute is initiated by either party before approval, escrowed funds are automatically frozen. No disbursements will occur until the dispute has been formally mediated and resolved.</li>
            <li><strong className="text-foreground">Platform Commissions:</strong> ArtisanConnect deducts a standard platform service fee from completed job payouts to fund infrastructure, customer protection, verification systems, and payment gateway costs.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-wide mt-8">
            6. Dispute Resolution
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            While ArtisanConnect encourages Customers and Artisans to resolve minor disagreements through direct communication, the Platform provides a two-phase dispute escalation protocol when satisfaction cannot be mutually attained:
          </p>
          <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-4">
            <li><strong className="text-foreground">Phase 1: AI-Assisted Fairness Scoring:</strong> The Platform utilizes an automated AI evaluation engine that reviews contract specifications, job chat logs, agreed milestone schedules, and photographic evidence submitted by both parties. The model generates an objective fairness assessment and proposed settlement recommendation.</li>
            <li><strong className="text-foreground">Phase 2: Administrative Review:</strong> If either party contests the AI-generated recommendation, or if the dispute involves complex structural claims, the case is escalated to human administrative adjudicators. Platform administrators review evidence, may request supplemental documentation, and issue a binding escrow disbursement determination.</li>
          </ul>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Administrative adjudications regarding escrow funds (including full release, partial settlement, or full customer refund) are final and conclusive with respect to the Platform&apos;s escrow holding obligations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-wide mt-8">
            7. User Conduct & Prohibited Activities
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Users must maintain professional conduct and integrity when utilizing the Platform. The following actions are strictly prohibited:
          </p>
          <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-4">
            <li>Fee avoidance: soliciting, facilitating, or accepting off-platform direct payments for contacts established through ArtisanConnect.</li>
            <li>Submitting forged, fraudulent, or altered Ghana Cards, vocational certifications, or business registrations.</li>
            <li>Submitting fraudulent service requests, deceptive quotations, or fabricated reviews and ratings.</li>
            <li>Harassing, threatening, defaming, or discriminating against any user on grounds of ethnicity, religion, gender, disability, or nationality.</li>
            <li>Performing structural, high-voltage electrical, or specialized work without possessing statutory licenses or certifications required under Ghanaian law.</li>
            <li>Reverse engineering, scraping, decompiling, or deploying automated scrapers, bots, or unauthorized scripts against the Platform.</li>
          </ul>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Violations of these standards may lead to immediate account suspension, permanent platform blacklisting, forfeiture of pending claims, and referral to the Ghana Police Service or relevant regulatory bodies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-wide mt-8">
            8. Intellectual Property
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            All rights, title, and interest in and to the ArtisanConnect platform, including software code, algorithms, interface designs, trademarks, logos, and graphics, are the exclusive property of ArtisanConnect or its technology licensors.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            By uploading project descriptions, photographic portfolios, comments, or reviews, you grant ArtisanConnect a perpetual, non-exclusive, royalty-free, worldwide license to host, display, reproduce, and adapt such content solely for platform operations, marketing, and verification purposes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-wide mt-8">
            9. Limitation of Liability
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The Platform is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express, statutory, or implied. ArtisanConnect disclaims all warranties regarding artisan workmanship, timeliness, structural integrity, or fitness for a particular purpose.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            To the maximum extent permitted by applicable Ghanaian law, ArtisanConnect, its directors, employees, and agents shall not be liable for any indirect, incidental, punitive, or consequential damages, including loss of profits, property damage, bodily injury, or disruption of business arising from artisan performance or platform use.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            In any circumstance, ArtisanConnect&apos;s aggregate liability arising out of or related to these Terms or any transaction shall be strictly capped at the total platform fees collected by ArtisanConnect for the specific booking at issue.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-wide mt-8">
            10. Termination
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            You may deactivate your account at any time by contacting customer support, provided there are no active service contracts, pending escrow holdings, or unresolved disputes linked to your account.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            ArtisanConnect reserves the right to immediately terminate or suspend your account, without prior notice, if you breach these Terms, commit fraudulent acts, fail identity verification checks, or pose safety hazards to other platform participants.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Provisions regarding Escrow Terms, Limitation of Liability, Intellectual Property, Dispute Resolution, and Governing Law shall survive termination of your account.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-wide mt-8">
            11. Governing Law
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            These Terms of Service, their interpretation, and any claims or disputes arising out of or in connection with them shall be governed by and construed in accordance with the laws of the Republic of Ghana.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Any dispute not conclusively resolved through the Platform&apos;s internal dispute resolution procedures shall be submitted to the exclusive jurisdiction of the competent courts of the Republic of Ghana.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-wide mt-8">
            12. Contact Information
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            If you have questions, inquiries, or legal notices concerning these Terms of Service, please contact our legal and support team:
          </p>
          <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-4">
            <li><strong className="text-foreground">Legal Inquiries:</strong> legal@artisanconnect.com</li>
            <li><strong className="text-foreground">Customer Support:</strong> support@artisanconnect.com</li>
            <li><strong className="text-foreground">Headquarters:</strong> Accra, Greater Accra Region, Republic of Ghana</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
