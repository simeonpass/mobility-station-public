import type { Metadata } from "next";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata: Metadata = { title:"Book an XSTO Demonstration | KLYM Mobility", description:"Book a demonstration of the XSTO M4, M4B, M4 Pro, X12 or X12 Pro with KLYM Mobility." };

export default function DemoPage(){return <main className="page-shell"><section className="page-hero"><p className="eyebrow plain">BOOK A DEMONSTRATION</p><h1>Experience XSTO before you choose.</h1><p>Tell us which model interests you and where you are based. Your request goes directly into the Mobility Station V1 sales workflow for the KLYM team to follow up.</p></section><section className="content-section"><div className="form-wrap"><div><p className="eyebrow plain">KLYM X XSTO</p><h2>Start with the M4B.</h2><p>The M4B is our featured model, but we can also help you compare it with the M4, M4 Pro, X12 and X12 Pro.</p><p>We can discuss VAT relief, delivery, suitability, dimensions and the best way for you to see the product.</p></div><EnquiryForm /></div></section></main>}
