import Link from "next/link";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Terms & Conditions",
  description:
    "Terms and conditions for purchasing mobility equipment and vehicle adaptation services from Mobility Station.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="container-site max-w-4xl py-12 md:py-16">
      <h1 className="text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
        Terms &amp; Conditions
      </h1>
      <p className="mt-2 text-sm text-muted">Last updated: February 2026</p>

      <div className="legal-prose mt-8 space-y-6">
        <section>
          <h2>1. About These Terms</h2>
          <p>
            These terms and conditions apply to all purchases made through the
            Mobility Station website (mobilitystation.co.uk) and to services
            provided by Mobility Station. By placing an order, you agree to be
            bound by these terms.
          </p>
        </section>

        <section>
          <h2>2. Orders &amp; Pricing</h2>
          <ul>
            <li>
              Catalogue prices are shown in GBP (£). For eligible mobility
              products we display the VAT relief price (ex VAT) and the standard
              price including 20% VAT. Second-hand items are sold under the
              margin scheme (no VAT). See our{" "}
              <Link href="/vat-relief">VAT Relief</Link> page for eligibility.
            </li>
            <li>We reserve the right to correct pricing errors before despatch</li>
            <li>
              An order is accepted once we send you an order confirmation email
            </li>
            <li>
              Some products may require a deposit prior to ordering or manufacture
            </li>
          </ul>
        </section>

        <section>
          <h2>3. VAT Exemption</h2>
          <p>
            Customers who are chronically sick or disabled may be eligible to
            purchase certain products without paying VAT. You must complete a VAT
            exemption declaration at checkout. Making a false declaration is a
            criminal offence. Full details are on our{" "}
            <Link href="/vat-relief">VAT Relief</Link> page.
          </p>
        </section>

        <section>
          <h2>4. Delivery</h2>
          <p>
            We offer <strong>free delivery on every order to mainland UK</strong>
            . Small and medium items are sent via tracked courier; large items are
            shipped on a kerbside pallet. Pallet deliveries require a signature,
            and you must be able to accept a pallet at the delivery address.
            Highlands &amp; Islands, Northern Ireland, Isle of Man and Channel
            Islands may incur an additional surcharge — please contact us for a
            quote before ordering. Estimates are not guaranteed; you&apos;ll be
            notified of any significant delays.
          </p>
        </section>

        <section>
          <h2>5. Returns &amp; Cancellations</h2>
          <p>
            Under the Consumer Contracts Regulations 2013, you have 14 days from
            the date of delivery to cancel your order for a full refund, provided
            the product is unused and in its original packaging.
          </p>
          <ul>
            <li>
              Made-to-order or customised products are excluded from the right to
              cancel
            </li>
            <li>
              Products that have been installed or modified cannot be returned
            </li>
            <li>
              <strong>Vehicle adaptations are non-refundable.</strong> All
              adaptation work is bespoke, made to order, and includes professional
              fitting to your specific vehicle. Once an adaptation order has been
              placed, it cannot be cancelled or refunded
            </li>
            <li>
              Return shipping costs are the customer&apos;s responsibility unless
              the item is faulty
            </li>
            <li>
              Refunds are processed within 14 days of receiving the returned item
            </li>
          </ul>
        </section>

        <section>
          <h2>6. Warranties &amp; Back-to-Base Service</h2>
          <p>
            All products carry the manufacturer&apos;s warranty. Warranty periods
            vary by product — details are provided on individual product pages and
            in your order documentation. Warranty does not cover damage caused by
            misuse, normal wear and tear, or unauthorised modifications.
          </p>
          <p className="mt-2">
            <strong>Service area.</strong> We provide on-site warranty service
            within our local catchments — approximately 30 miles of our Heathrow
            branch and 60 miles of our Ferndown branch. Outside those areas,
            warranty repairs operate on a <strong>back-to-base</strong> basis: the
            customer arranges and pays for the item to be returned to us; once
            repaired, we cover the return delivery back to the customer.
          </p>
        </section>

        <section>
          <h2>7. Vehicle Adaptations</h2>
          <p>Where we provide vehicle adaptation services:</p>
          <ul>
            <li>A detailed quotation will be provided before work commences</li>
            <li>
              Work will be carried out to manufacturer specifications and
              applicable safety standards
            </li>
            <li>
              You are responsible for ensuring your insurance covers the
              adaptation
            </li>
            <li>
              Adapted vehicles must still pass standard MOT testing requirements
            </li>
          </ul>
          <p className="mt-2">
            Browse adaptations on our{" "}
            <Link href="/vehicle-adaptations">vehicle adaptations</Link> pages.
          </p>
        </section>

        <section>
          <h2>8. Home Demonstrations</h2>
          <p>
            Branch demonstrations at Heathrow and Ferndown are free. Home
            demonstrations are £195 flat (vehicle adaptations, scooters, powered
            and manual wheelchairs — private or Motability). The fee is
            non-refundable but is deducted in full from the purchase price if
            you go ahead. It is waived for the Motability Powered Wheelchair
            &amp; Scooter Scheme (PWSS). Full details are on our{" "}
            <Link href="/book-a-demo#demo-terms">book a demonstration</Link>{" "}
            page.
          </p>
        </section>

        <section>
          <h2>9. Limitation of Liability</h2>
          <p>
            Nothing in these terms limits our liability for death or personal
            injury caused by negligence, fraud, or any other liability that cannot
            be excluded by law. Our total liability for any claim shall not exceed
            the price paid for the relevant product or service.
          </p>
        </section>

        <section>
          <h2>10. Governing Law</h2>
          <p>
            These terms are governed by English law. Any disputes will be subject
            to the exclusive jurisdiction of the courts of England and Wales.
          </p>
        </section>

        <section>
          <h2>11. Contact</h2>
          <p>
            Mobility Station (a trading name of Adaptation Station Ltd)
            <br />
            1-2 Horton Close, West Drayton, UB7 8EB
            <br />
            Email:{" "}
            <a href="mailto:hello@mobilitystation.co.uk">
              hello@mobilitystation.co.uk
            </a>
            <br />
            Phone: <a href="tel:08007723870">0800 772 3870</a>
          </p>
        </section>
      </div>
    </div>
  );
}
