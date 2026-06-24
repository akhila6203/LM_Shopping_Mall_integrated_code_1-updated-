import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, Minus, Send, Sparkles, Search, HelpCircle, 
  MessageCircle, Phone, Mail, ChevronRight, Award,
  Truck, RefreshCw, Shield, Package, CreditCard,
  ArrowRight, ThumbsUp, Clock, MapPin, Star
} from "lucide-react";

const faqData = [
  {
    category: "Orders & Shipping",
    icon: Truck,
    color: "from-blue-500 to-cyan-600",
    faqs: [
      { q: "How long does shipping take?", a: "Standard shipping takes 5-7 business days within India. Express shipping takes 2-3 business days. Delivery times may vary during festive seasons." },
      { q: "What are the shipping charges?", a: "We offer FREE standard shipping on all orders above ₹999. For orders below this amount, a nominal shipping fee of ₹99 is applied at checkout." },
      { q: "How can I track my order?", a: "Once your order is dispatched, you will receive an email with tracking details. You can also visit the 'Track Order' page from our footer and enter your Order ID to see real-time updates." },
      { q: "Do you ship internationally?", a: "Yes, we ship to USA, UK, Canada, Australia, and 15+ other countries. International shipping takes 10-15 business days depending on customs clearance. Import duties may apply." }
    ]
  },
  {
    category: "Returns & Refunds",
    icon: RefreshCw,
    color: "from-green-500 to-emerald-600",
    faqs: [
      { q: "What is your return policy?", a: "We accept returns within 7 days of delivery. The items must be unstitched, unused, and in their original packaging. Custom stitched items or fabrics cut to order cannot be returned." },
      { q: "How long does it take to process a refund?", a: "Once we receive and inspect your returned item, refunds are processed within 5-7 business days directly to your original payment method. You'll receive an email confirmation once processed." },
      { q: "Do I have to pay for return shipping?", a: "If you receive a defective or wrong product, we cover the return shipping costs. For other preference-based returns, a nominal pickup fee of ₹150 will be deducted from your refund." },
      { q: "Can I exchange an item?", a: "Yes, exchanges are available for size-related issues. Please initiate an exchange request within 7 days of delivery. The replacement will be shipped once we receive the original item." }
    ]
  },
  {
    category: "Products & Services",
    icon: Package,
    color: "from-purple-500 to-indigo-600",
    faqs: [
      { q: "Are the silk sarees authentic?", a: "Absolutely. All our Kanchipuram, Banarasi, and Chanderi silk sarees come with an official Silk Mark certification ensuring 100% purity and authenticity. Each saree includes a certification tag." },
      { q: "Do you provide custom blouse stitching?", a: "Yes, we provide premium custom tailoring services. Once you place an order, you can contact our support team on WhatsApp with your Order ID to share your measurements. Stitching takes 3-4 working days." },
      { q: "How do I know my correct size for Kurtas?", a: "We have a detailed 'Size Guide' available in our website's footer. It provides exact chest, waist, and length measurements. You can also chat with our stylists for personalized sizing advice." },
      { q: "How should I wash my ethnic wear?", a: "For all our pure silk sarees, heavy zari dupattas, and premium fabrics, we highly recommend 'Dry Clean Only' to maintain the fabric's shine and longevity. Cotton items can be gently hand washed." }
    ]
  },
  {
    category: "Payment & Security",
    icon: Shield,
    color: "from-orange-500 to-red-600",
    faqs: [
      { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, UPI (Google Pay, PhonePe, Paytm), Net Banking, and Cash on Delivery for orders up to ₹5,000." },
      { q: "Is my payment information secure?", a: "Yes, absolutely. We use 256-bit SSL encryption and never store your card details. All payments are processed through secure, PCI-compliant payment gateways." },
      { q: "Can I get a GST invoice?", a: "Yes, GST invoices are provided for all orders. You can enter your GST details during checkout, and the invoice will be emailed to you along with your order confirmation." },
      { q: "What if my payment fails?", a: "If your payment fails, don't worry. Money deducted will be automatically refunded to your source account within 5-7 business days. You can try placing the order again." }
    ]
  }
];

// Popular questions quick links
const popularQuestions = [
  "How to track my order?",
  "What is the return policy?",
  "Are silk sarees authentic?",
  "Do you ship internationally?"
];

// Trust badges
const trustBadges = [
  { icon: Award, title: "Silk Mark Certified", desc: "100% Authentic" },
  { icon: Truck, title: "Free Shipping", desc: "Above ₹999" },
  { icon: RefreshCw, title: "Easy Returns", desc: "7-day policy" },
  { icon: Shield, title: "Secure Payment", desc: "256-bit SSL" }
];

const Faq = () => {
  const [openId, setOpenId] = useState("0-0");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  // Filter FAQs based on search
  const getFilteredFAQs = () => {
    if (!searchQuery) return faqData;
    
    return faqData.map(category => ({
      ...category,
      faqs: category.faqs.filter(faq => 
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(category => category.faqs.length > 0);
  };

  const filteredFAQs = getFilteredFAQs();
  const categories = ["All", ...faqData.map(c => c.category)];

  const handleQuickQuestion = (question) => {
    setSearchQuery(question.replace("?", ""));
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50">
      
      {/* ======================================================= */}
      {/* 🌟 PREMIUM HERO HEADER */}
      {/* ======================================================= */}
      <div className="relative w-full bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 py-16 md:py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{ 
            backgroundImage: 'radial-gradient(circle at 20% 30%, #fff 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Animated Gradients */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-xs uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-6">
            <HelpCircle className="w-3 h-3 text-primary" />
            How Can We Help?
            <HelpCircle className="w-3 h-3 text-primary" />
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-4 tracking-tight">
            Frequently Asked <span className="text-primary italic">Questions</span>
          </h1>
          <p className="font-body text-gray-200 text-sm md:text-base max-w-2xl mx-auto">
            Find quick answers to your questions about our products, shipping, returns, and more
          </p>
        </div>
      </div>

      {/* ======================================================= */}
      {/* TRUST BADGES */}
      {/* ======================================================= */}
      <div className="container mx-auto px-4 -mt-6 relative z-20">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-stone-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {trustBadges.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <badge.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-stone-800 text-sm">{badge.title}</h4>
                    <p className="text-xs text-stone-500">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl py-12">
        
        {/* ======================================================= */}
        {/* SEARCH BAR */}
        {/* ======================================================= */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-2xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* ======================================================= */}
        {/* POPULAR QUESTIONS QUICK LINKS */}
        {/* ======================================================= */}
        {!searchQuery && (
          <div className="mb-10">
            <h3 className="font-heading text-lg text-stone-800 mb-4 flex items-center gap-2">
              <ThumbsUp className="w-5 h-5 text-primary" />
              Popular Questions
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(question)}
                  className="px-4 py-2 bg-white border border-stone-200 rounded-full text-sm text-stone-600 hover:border-primary hover:text-primary transition-all"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* CATEGORY TABS */}
        {/* ======================================================= */}
        {!searchQuery && (
          <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-stone-200">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-primary hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* ======================================================= */}
        {/* FAQ SECTIONS */}
        {/* ======================================================= */}
        <div className="space-y-8">
          {filteredFAQs.map((section, catIndex) => {
            const IconComponent = section.icon;
            const shouldShow = activeCategory === "All" || activeCategory === section.category;
            
            if (!shouldShow) return null;
            
            return (
              <div key={catIndex} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-5">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${section.color}`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="font-heading text-2xl text-stone-800">
                    {section.category}
                  </h2>
                  <span className="text-xs text-stone-400 bg-stone-100 px-3 py-1 rounded-full">
                    {section.faqs.length} articles
                  </span>
                </div>
                
                <div className="space-y-3">
                  {section.faqs.map((faq, faqIndex) => {
                    const uniqueId = `${catIndex}-${faqIndex}`;
                    const isOpen = openId === uniqueId;

                    return (
                      <div 
                        key={faqIndex} 
                        className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${
                          isOpen 
                            ? 'border-primary/30 shadow-lg' 
                            : 'border-stone-200 hover:border-primary/30 hover:shadow-md'
                        }`}
                        onMouseEnter={() => setHoveredCategory(catIndex)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      >
                        <button 
                          onClick={() => toggleFaq(uniqueId)}
                          className="w-full flex items-center justify-between p-5 text-left"
                        >
                          <span className={`font-heading text-base md:text-lg pr-4 transition-colors ${
                            isOpen ? 'text-primary' : 'text-stone-800'
                          }`}>
                            {faq.q}
                          </span>
                          <span className={`shrink-0 p-1.5 rounded-full transition-all ${
                            isOpen ? 'bg-primary text-white' : 'bg-stone-100 text-stone-500'
                          }`}>
                            {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                          </span>
                        </button>
                        
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                          <div className="px-5 pb-5">
                            <div className="h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent mb-4"></div>
                            <p className="text-stone-600 text-sm leading-relaxed">
                              {faq.a}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* ======================================================= */}
        {/* NO RESULTS */}
        {/* ======================================================= */}
        {filteredFAQs.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h3 className="font-heading text-xl text-stone-800 mb-2">No results found</h3>
            <p className="text-stone-500 mb-6">Try searching with different keywords</p>
            <button 
              onClick={() => setSearchQuery("")}
              className="text-primary hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
        
        {/* ======================================================= */}
        {/* CONTACT SUPPORT BANNER */}
        {/* ======================================================= */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-primary/5 via-amber-500/5 to-primary/5 rounded-3xl p-8 md:p-12 border border-stone-100">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs uppercase tracking-wider text-stone-600">Still need help?</span>
              </div>
              <h3 className="font-heading text-2xl md:text-3xl text-stone-800 mb-3">
                Can't find what you're looking for?
              </h3>
              <p className="text-stone-500 mb-8 max-w-xl mx-auto">
                Our customer support team is available 24/7 to assist you with any questions or concerns.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  to="/contact" 
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  <MessageCircle className="w-5 h-5" />
                  Contact Support
                  <ArrowRight className="w-4 h-4" />
                </Link>
                
                <a 
                  href="tel:+919876543210" 
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-stone-700 px-8 py-4 rounded-full font-medium border border-stone-200 hover:border-primary hover:text-primary transition-all"
                >
                  <Phone className="w-5 h-5" />
                  Call Us
                </a>
                
                <a 
                  href="mailto:support@llmshop.com" 
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-stone-700 px-8 py-4 rounded-full font-medium border border-stone-200 hover:border-primary hover:text-primary transition-all"
                >
                  <Mail className="w-5 h-5" />
                  Email Us
                </a>
              </div>
              
              <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-stone-200">
                <div className="flex items-center gap-2 text-sm text-stone-500">
                  <Clock className="w-4 h-4" />
                  Response within 2 hours
                </div>
                <div className="flex items-center gap-2 text-sm text-stone-500">
                  <MapPin className="w-4 h-4" />
                  Available Worldwide
                </div>
                <div className="flex items-center gap-2 text-sm text-stone-500">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  4.9/5 Support Rating
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================= */}
        {/* QUICK LINKS */}
        {/* ======================================================= */}
       
      </div>
    </div>
  );
};

export default Faq;