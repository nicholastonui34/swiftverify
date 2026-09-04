import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import { ConsultationButton } from "./ConsultationModal";

export const documentFaqs = [
  {
    question: "What document verification services do you provide?",
    answer: "We help clients structure and present authentic KYC documents, Proof of Address, work contracts, invoices, business URLs, company profiles, quotations and other legitimate business assets for clearer review by a provider or partner.",
  },
  {
    question: "Can you create or alter a verification document for me?",
    answer: "No. SwiftVerify does not forge, alter or misrepresent documents. We only format and organize genuine, client-provided information and explain the legitimate submission requirements.",
  },
  {
    question: "What documents should I prepare before contacting you?",
    answer: "Prepare a clear description of your goal, the provider or platform involved, the exact request or rejection message, and the authentic documents you already have. Do not send passwords, one-time codes or unnecessary sensitive information.",
  },
  {
    question: "Can you help with Proof of Address or KYC formatting?",
    answer: "Yes. We can review layout, consistency, readability and completeness of authentic Proof of Address, identity, business registration and related KYC materials before you submit them yourself.",
  },
  {
    question: "Can you prepare a work contract, invoice or business URL?",
    answer: "We can advise on the structure and professional presentation of legitimate work contracts, invoices, business URLs, company profiles and related industry documents. The underlying engagement, transaction and business information must be real and supportable.",
  },
  {
    question: "Does formatting guarantee approval or verification?",
    answer: "No. The relevant provider, bank or platform makes the final decision. Our role is to help you understand the requirements and present accurate, consistent information—not to bypass eligibility or compliance checks.",
  },
];

export function DocumentFaqSection() {
  return <section id="faq" className="scroll-mt-20 bg-[#f5f7f4] px-5 py-20 sm:px-8 sm:py-24"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20"><div><div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#d9f7e8] text-[#14845e]"><MessageCircleQuestion className="h-6 w-6" /></div><p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[#14845e]">Document verification FAQ</p><h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#081624] sm:text-5xl">Clear answers before you share your documents.</h2><p className="mt-5 max-w-md text-base leading-7 text-slate-600">Have a question about authentic KYC documents, business assets or the review process? Start here, then speak with our team for guidance specific to your situation.</p><ConsultationButton action="quote" className="mt-7 inline-flex items-center justify-center rounded-full bg-[#14845e] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0f704f]">Ask about your documents</ConsultationButton></div><div className="space-y-3">{documentFaqs.map((faq) => <details key={faq.question} className="group rounded-2xl border border-slate-200 bg-white px-5 transition open:border-[#abd4c1] open:shadow-[0_12px_30px_rgba(8,22,36,0.05)]"><summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-base font-semibold text-[#081624] [&::-webkit-details-marker]:hidden"><span>{faq.question}</span><ChevronDown className="h-5 w-5 shrink-0 text-[#14845e] transition-transform group-open:rotate-180" /></summary><p className="max-w-2xl pb-5 pr-8 text-sm leading-7 text-slate-600">{faq.answer}</p></details>)}</div></div></section>;
}
