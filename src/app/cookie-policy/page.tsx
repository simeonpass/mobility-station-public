import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Cookie Policy",
  description:
    "Learn how Mobility Station uses cookies on our website and how you can manage your preferences.",
  path: "/cookie-policy",
});

export default function CookiePolicyPage() {
  return (
    <div className="container-site max-w-4xl py-12 md:py-16">
      <h1 className="text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
        Cookie Policy
      </h1>
      <p className="mt-2 text-sm text-muted">Last updated: February 2026</p>

      <div className="legal-prose mt-8 space-y-6">
        <section>
          <h2>What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device when you visit a
            website. They help the website remember your preferences and improve
            your browsing experience.
          </p>
        </section>

        <section>
          <h2>Cookies We Use</h2>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Cookie</th>
                  <th>Purpose</th>
                  <th>Type</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-mono text-xs">ms-cart</td>
                  <td>Stores your shopping basket contents</td>
                  <td>Functional</td>
                  <td>Until cleared</td>
                </tr>
                <tr>
                  <td className="font-mono text-xs">ms_cookie_consent</td>
                  <td>Remembers your cookie preferences (when shown)</td>
                  <td>Essential</td>
                  <td>1 year</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>Managing Cookies</h2>
          <p>
            You can manage or delete cookies through your browser settings.
            Please note that disabling essential or functional cookies may affect
            website features such as the basket. Most browsers allow you to:
          </p>
          <ul>
            <li>View and delete existing cookies</li>
            <li>Block all or third-party cookies</li>
            <li>Set preferences for specific websites</li>
          </ul>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>
            If you have questions about our use of cookies, please contact us at{" "}
            <a href="mailto:hello@mobilitystation.co.uk">
              hello@mobilitystation.co.uk
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
