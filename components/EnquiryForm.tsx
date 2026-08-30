"use client";

import { FormEvent, useState } from "react";

const endpoint = "https://evgvbvvpiculuizvvqyh.supabase.co/functions/v1/klym-enquiry";

export default function EnquiryForm({ defaultProduct = "XSTO M4B", type = "demo" }: { defaultProduct?: string; type?: "demo"|"sales"|"callback"|"general" }) {
  const [status, setStatus] = useState<{kind:"idle"|"sending"|"ok"|"err"; message:string}>({kind:"idle",message:""});
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({kind:"sending",message:"Sending…"});
    const form = e.currentTarget;
    const fd = new FormData(form);
    const body = Object.fromEntries(fd.entries());
    try {
      const res = await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...body,type})});
      const data = await res.json().catch(()=>({}));
      if(!res.ok) throw new Error(data.error || "We couldn't send your enquiry.");
      form.reset();
      setStatus({kind:"ok",message:"Thank you — your enquiry is now in the KLYM sales queue."});
    } catch(err) {
      setStatus({kind:"err",message:err instanceof Error ? err.message : "We couldn't send your enquiry."});
    }
  }
  return <form className="enquiry-form" onSubmit={submit}>
    <input className="honeypot" name="company" tabIndex={-1} autoComplete="off" />
    <div className="form-row"><div className="field"><label htmlFor="name">Name</label><input id="name" name="name" required /></div><div className="field"><label htmlFor="phone">Phone</label><input id="phone" name="phone" type="tel" /></div></div>
    <div className="form-row"><div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" /></div><div className="field"><label htmlFor="postcode">Postcode</label><input id="postcode" name="postcode" /></div></div>
    <div className="field"><label htmlFor="product">Which XSTO?</label><select id="product" name="product" defaultValue={defaultProduct}><option>XSTO M4B</option><option>XSTO M4</option><option>XSTO M4 Pro</option><option>XSTO X12</option><option>XSTO X12 Pro</option><option>Not sure yet</option></select></div>
    <div className="field"><label htmlFor="message">How can we help?</label><textarea id="message" name="message" placeholder="Tell us what you would like to know, or where you would like a demonstration." /></div>
    <button className="btn blue" type="submit" disabled={status.kind==="sending"}>{status.kind==="sending" ? "Sending…" : type==="demo" ? "Request my demonstration →" : "Send enquiry →"}</button>
    {status.kind!=="idle" && <p className={`form-status ${status.kind}`}>{status.message}</p>}
  </form>;
}
