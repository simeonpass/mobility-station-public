export const DNA_SDK_URL =
  "https://pay.dnapayments.com/checkout/payment-api.js";

export type DnaPaymentData = Record<string, unknown>;

declare global {
  interface Window {
    DNAPayments?: {
      openPaymentPage: (config: DnaPaymentData) => void;
      configure?: (config: { isTestMode: boolean }) => void;
    };
  }
}

/** Load the DNA hosted-checkout SDK (idempotent). */
export function loadDnaPaymentsSdk(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("DNA Payments SDK requires a browser"));
  }

  if (window.DNAPayments) {
    try {
      window.DNAPayments.configure?.({ isTestMode: false });
    } catch {
      /* ignore */
    }
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const existing = document.getElementById(
      "dna-payments-sdk",
    ) as HTMLScriptElement | null;

    const markReady = () => {
      if (!window.DNAPayments) {
        reject(new Error("DNA Payments SDK loaded but is unavailable"));
        return;
      }
      try {
        window.DNAPayments.configure?.({ isTestMode: false });
      } catch {
        /* ignore */
      }
      resolve();
    };

    if (existing) {
      const pollStart = Date.now();
      const pollId = window.setInterval(() => {
        if (window.DNAPayments) {
          window.clearInterval(pollId);
          markReady();
        } else if (Date.now() - pollStart > 12000) {
          window.clearInterval(pollId);
          reject(new Error("Timed out waiting for DNA Payments SDK"));
        }
      }, 400);
      return;
    }

    const script = document.createElement("script");
    script.id = "dna-payments-sdk";
    script.src = DNA_SDK_URL;
    script.async = true;
    script.onload = () => markReady();
    script.onerror = () =>
      reject(
        new Error(
          "Could not load DNA Payments. Check your connection or try PayPal.",
        ),
      );
    document.body.appendChild(script);
  });
}

export function openDnaPaymentPage(paymentData: DnaPaymentData) {
  if (!window.DNAPayments?.openPaymentPage) {
    throw new Error("DNA Payments SDK is not ready");
  }
  window.DNAPayments.openPaymentPage(paymentData);
}
