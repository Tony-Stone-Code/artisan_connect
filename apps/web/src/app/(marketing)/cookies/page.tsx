import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Cookie Policy for the ArtisanConnect platform.',
};

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 border-x border-border max-w-5xl bg-card">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-3 pb-8 border-b border-border">
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wide">
            Cookie Policy
          </h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono">
            Last updated: October 2026
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            This Cookie Policy explains how ArtisanConnect (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) uses cookies and similar storage technologies on our platform. We maintain a minimal, privacy-first approach: we only use essential cookies necessary to deliver authentication and secure marketplace services, alongside basic functional preference storage.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-wide mt-8">
            1. What Are Cookies
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Cookies are small text files or key-value data stored on your computer, tablet, or mobile phone by websites you visit. They are widely used to make web applications function efficiently, preserve login sessions, remember user interface settings, and provide security protection against malicious activities.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            In addition to HTTP cookies, modern web applications may utilize browser Local Storage or Session Storage to maintain interface preferences across visits without transmitting extraneous tracking data over the network.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-wide mt-8">
            2. How We Use Cookies
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            ArtisanConnect uses cookies and browser storage solely to ensure the platform operates reliably, securely, and seamlessly. We do not engage in behavioral advertising, cross-site tracking, or data brokering. Specifically:
          </p>
          <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-4">
            <li><strong className="text-foreground">Authentication & Session Security:</strong> We use essential cookies managed via Supabase to keep you securely signed in to your Customer or Artisan account as you navigate pages and interact with escrow transactions.</li>
            <li><strong className="text-foreground">Interface Preferences:</strong> We use local browser storage to remember your preferred visual display mode (light, dark, or system theme) and record whether you have acknowledged our cookie notice.</li>
            <li><strong className="text-foreground">No Advertising Cookies:</strong> ArtisanConnect does NOT set any third-party marketing cookies, targeted advertising trackers, or social network profiling pixels.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-wide mt-8">
            3. Types of Cookies Used
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The cookies and local storage tokens utilized on the ArtisanConnect platform fall strictly into two functional categories:
          </p>

          <div className="space-y-4 pt-2">
            <div className="p-4 bg-muted/40 border border-border">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-2">
                A. Strictly Necessary Cookies
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                These cookies are indispensable for the core operation of the Platform. Without them, secure authentication, escrow account access, and protection against Cross-Site Request Forgery (CSRF) cannot function.
              </p>
              <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-4">
                <li><code className="text-xs bg-muted px-1.5 py-0.5 border border-border text-foreground font-mono">sb-*-auth-token</code>: Supabase session authentication token used to authenticate API requests and maintain secure user login state. (Duration: Session / Persistent up to 1 year or until sign-out).</li>
                <li><code className="text-xs bg-muted px-1.5 py-0.5 border border-border text-foreground font-mono">sb-*-auth-token-code-verifier</code>: PKCE cryptographic token used to verify authorization code exchanges securely. (Duration: Temporary during login).</li>
              </ul>
            </div>

            <div className="p-4 bg-muted/40 border border-border">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-2">
                B. Functional Storage
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                Functional storage items enable the Platform to remember configuration choices you make to provide an enhanced and personalized experience.
              </p>
              <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-4">
                <li><code className="text-xs bg-muted px-1.5 py-0.5 border border-border text-foreground font-mono">theme</code>: Browser Local Storage key storing your preferred UI appearance (system default, dark mode, or light mode). (Duration: Persistent).</li>
                <li><code className="text-xs bg-muted px-1.5 py-0.5 border border-border text-foreground font-mono">cookie-consent</code>: Browser Local Storage key recording your acknowledgement (&apos;accepted&apos; or &apos;declined&apos;) of the platform cookie notice. (Duration: Persistent).</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-wide mt-8">
            4. Managing Cookies
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Most modern web browsers allow you to manage and configure cookie settings according to your personal preferences. You can configure your browser to block cookies, delete existing cookies, or notify you when a cookie is placed on your device.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            You can modify your browser cookie preferences through your browser settings menu:
          </p>
          <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-4">
            <li>Google Chrome: Settings &gt; Privacy and security &gt; Third-party cookies</li>
            <li>Mozilla Firefox: Settings &gt; Privacy &amp; Security &gt; Cookies and Site Data</li>
            <li>Apple Safari: Settings &gt; Safari &gt; Advanced &gt; Privacy</li>
            <li>Microsoft Edge: Settings &gt; Cookies and site permissions &gt; Manage and delete cookies</li>
          </ul>
          <p className="text-muted-foreground text-sm leading-relaxed">
            <strong className="text-foreground">Important Note on Disabling Cookies:</strong> Because ArtisanConnect only employs cookies strictly required for security and authentication, disabling all cookies will prevent you from logging into your account, booking artisans, depositing funds into escrow, or managing active work orders.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-wide mt-8">
            5. Contact
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            If you have any questions or require further clarification regarding our use of cookies and local storage technologies, please contact our team:
          </p>
          <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 ml-4">
            <li><strong className="text-foreground">Email:</strong> privacy@artisanconnect.com</li>
            <li><strong className="text-foreground">Customer Support:</strong> support@artisanconnect.com</li>
            <li><strong className="text-foreground">Location:</strong> Accra, Greater Accra Region, Republic of Ghana</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
