import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqData = [
  {
    question: "What is an IPO?",
    answer: "An IPO (Initial Public Offering) is when a private company offers its shares to the public for the first time. This allows companies to raise capital from public investors and enables individuals to buy ownership stakes in the company."
  },
  {
    question: "How to apply for an IPO?",
    answer: "You can apply for an IPO through your broker's platform or directly through the stock exchange. You'll need to have a demat account, provide your UPI ID or bank account details, and submit your application within the specified dates."
  },
  {
    question: "What is the minimum investment for IPO?",
    answer: "The minimum investment depends on the IPO's lot size and price band. For example, if the price is ₹100 per share and the lot size is 150 shares, the minimum investment would be ₹15,000."
  },
  {
    question: "How is IPO allotment decided?",
    answer: "IPO allotment follows SEBI guidelines. For retail investors (investing up to ₹2 lakhs), if the issue is oversubscribed, allotment is done through a lottery system to ensure fair distribution among all applicants."
  },
  {
    question: "When will I receive the allotted shares?",
    answer: "Allotted shares are typically credited to your demat account within 3-7 working days after the allotment finalization. You'll receive SMS and email notifications about the allotment status."
  },
  {
    question: "What happens if I don't get allotment?",
    answer: "If you don't receive allotment, the application amount will be refunded to your bank account within 7 working days. The refund process is automatic and doesn't require any action from your side."
  }
];

export function FAQSection() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className="bg-gray-50 py-12" data-testid="faq-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm" data-testid={`faq-item-${index}`}>
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none transition-colors"
                onClick={() => toggleItem(index)}
                data-testid={`button-faq-${index}`}
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                {openItems.has(index) ? (
                  <ChevronUp className="text-gray-400" size={20} />
                ) : (
                  <ChevronDown className="text-gray-400" size={20} />
                )}
              </button>
              {openItems.has(index) && (
                <div className="px-6 pb-4 text-gray-600 animate-slide-up" data-testid={`content-faq-${index}`}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
