import Link from "next/link";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Privacy Policy",
  description:
    "How Mobility Station collects, uses and protects your personal data in compliance with UK GDPR.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <div className="container-site max-w-4xl py-12 md:py-16">
      <h1 className="text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-muted">Last updated: February 2026</p>

      <div className="legal-prose mt-8 space-y-6">
        <section>
          <h2>1. Who We Are</h2>
          <p>
            Mobility Station (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is
            a UK-based supplier of mobility equipment and vehicle adaptations.
            Our registered address is 1-2 Horton Close, West Drayton, UB7 8EB. We
            are the data controller for the personal data we collect via this
            website.
          </p>
        </section>

        <section>
          <h2>2. What Data We Collect</h2>
          <p>We may collect the following personal data:</p>
          <ul>
            <li>
              Name, email address, phone number and postal address when you place
              an order or make an enquiry
            </li>
            <li>
              Payment information (processed securely via our payment providers —
              we do not store card details)
            </li>
            <li>
              Information about your mobility needs to help us recommend
              appropriate products
            </li>
            <li>
              VAT exemption details if you are eligible for VAT relief on
              disability-related products
            </li>
            <li>
              Website usage data via cookies (see our{" "}
              <Link href="/cookie-policy">Cookie Policy</Link>)
            </li>
            <li>Communication history when you contact us</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Data</h2>
          <p>We use your personal data to:</p>
          <ul>
            <li>Process and fulfil your orders</li>
            <li>Provide customer support and respond to enquiries</li>
            <li>Send order updates and delivery notifications</li>
            <li>Administer your account</li>
            <li>Process VAT exemption claims with HMRC where applicable</li>
            <li>Improve our website and services</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2>4. Legal Basis for Processing</h2>
          <p>We process your data on the following legal bases:</p>
          <ul>
            <li>
              <strong>Contract:</strong> To fulfil orders and provide requested
              services
            </li>
            <li>
              <strong>Legitimate interest:</strong> To improve our services and
              communicate relevant information
            </li>
            <li>
              <strong>Legal obligation:</strong> To comply with tax, accounting
              and regulatory requirements
            </li>
            <li>
              <strong>Consent:</strong> For marketing communications (you can
              withdraw consent at any time)
            </li>
          </ul>
        </section>

        <section>
          <h2>5. Data Sharing</h2>
          <p>We may share your data with:</p>
          <ul>
            <li>Delivery partners to fulfil your orders</li>
            <li>Payment processors to handle transactions securely</li>
            <li>HMRC for VAT exemption processing</li>
            <li>Motability Operations for Motability Scheme customers</li>
          </ul>
          <p className="mt-2">We do not sell your personal data to third parties.</p>
        </section>

        <section>
          <h2>6. Data Retention</h2>
          <p>
            We retain your personal data for as long as necessary to fulfil the
            purposes for which it was collected, including legal, accounting or
            reporting requirements. Order data is typically retained for 6 years
            in accordance with HMRC requirements.
          </p>
        </section>

        <section>
          <h2>7. Your Rights</h2>
          <p>Under UK GDPR, you have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data (where applicable)</li>
            <li>Object to or restrict processing</li>
            <li>Data portability</li>
            <li>Withdraw consent for marketing communications</li>
          </ul>
          <p className="mt-2">
            To exercise any of these rights, contact us at{" "}
            <a href="mailto:hello@mobilitystation.co.uk">
              hello@mobilitystation.co.uk
            </a>
            .
          </p>
        </section>

        <section>
          <h2>8. Contact Us</h2>
          <p>
            If you have questions about this policy or wish to make a complaint,
            please contact us:
          </p>
          <p className="mt-2">
            Email:{" "}
            <a href="mailto:hello@mobilitystation.co.uk">
              hello@mobilitystation.co.uk
            </a>
            <br />
            Phone: <a href="tel:08007723870">0800 772 3870</a>
            <br />
            Post: Mobility Station, 1-2 Horton Close, West Drayton, UB7 8EB
          </p>
          <p className="mt-2">
            You also have the right to lodge a complaint with the Information
            Commissioner&apos;s Office (ICO) at{" "}
            <a
              href="https://ico.org.uk"
              target="_blank"
              rel="noopener noreferrer"
            >
              ico.org.uk
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
