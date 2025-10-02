import SiteLogo from '@/components/site-logo';

export const metadata = {
  title: 'Privacy Policy | Shunt',
  description: 'Privacy Policy for Shunt',
};

export default function Page() {
  return (
    <>
      <SiteLogo className="w-36" />
      <div className="w-full max-w-3xl mx-auto mt-12">
        <div className="prose dark:prose-invert prose-base md:prose-lg py-8 space-y-6">
          <h1>Privacy Policy</h1>
          <p>
            <strong>Effective Date:</strong> April 10, 2025
          </p>
          <p>
            Shunt (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is
            committed to minimal data collection and maximum privacy. This
            policy outlines what we collect when someone clicks a Shunt link and
            how we handle it.
          </p>

          <h2>What We Collect</h2>
          <p>When a Shunt link is clicked, we temporarily process:</p>
          <ul>
            <li>
              <strong>Referrer URL</strong> – to understand how links are shared
            </li>
            <li>
              <strong>User Agent</strong> – to see which devices or browsers are
              used
            </li>
            <li>
              <strong>IP Address</strong> – for basic abuse prevention and
              analytics
            </li>
          </ul>
          <p>
            No personal information is collected or stored beyond this technical
            metadata.
          </p>

          <h2>Why We Collect It</h2>
          <p>We use this information to:</p>
          <ul>
            <li>Monitor traffic patterns</li>
            <li>Improve service reliability</li>
            <li>
              Detect and prevent abuse (e.g., spam, denial-of-service attempts)
            </li>
          </ul>
          <p>
            IP addresses may be retained briefly in server logs to support these
            goals, then deleted or anonymized.
          </p>

          <h2>What We Don’t Do</h2>
          <ul>
            <li>No cookies</li>
            <li>No tracking across websites</li>
            <li>No selling or sharing of your data</li>
            <li>No personal accounts or user profiles</li>
          </ul>

          <h2>GDPR &amp; CCPA</h2>
          <p>
            Shunt does not collect or store <strong>personal data</strong> as
            defined under the{' '}
            <strong>General Data Protection Regulation (GDPR)</strong> or{' '}
            <strong>California Consumer Privacy Act (CCPA)</strong>.
          </p>
          <p>
            If you believe your IP address or device data has been improperly
            logged and wish to request deletion, contact us — we’ll comply with
            applicable data protection laws.
          </p>

          {/* <h2>Contact</h2>
          <p>Questions or concerns?<br /><strong>Email:</strong> [your email here]</p> */}
        </div>
      </div>
    </>
  );
}
