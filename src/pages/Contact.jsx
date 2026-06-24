import React, { useState, useEffect, useMemo } from "react";
import {
  MapPin, Phone, Mail, Facebook, Send, CheckCircle2, Instagram,
  Clock, Sparkles, ChevronRight, MessageCircle,
  Globe, ArrowRight, Building,
  Twitter, Youtube, Linkedin
} from "lucide-react";

import { getStoreInformation, getContactPage } from "@/services/contactService";

const onlyDigits = (value = "") => String(value || "").replace(/\D/g, "");

const defaultStoreHours = [
  { day: "Monday - Saturday", hours: "10:00 AM - 8:00 PM" },
  { day: "Sunday", hours: "11:00 AM - 6:00 PM" },
  { day: "Festival Days", hours: "10:00 AM - 9:00 PM" },
];

const Contact = () => {
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactInfo, setContactInfo] = useState({});
  const [activeTab, setActiveTab] = useState("message");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    subject: "General Inquiry",
  });

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const [storeData, contactData] = await Promise.all([
          getStoreInformation(),
          getContactPage(),
        ]);

        setContactInfo({
          companyName: storeData?.companyName || "",

          contactEmail:
            storeData?.contactEmail ||
            contactData?.emailAddress ||
            "",

          phoneNumber:
            storeData?.phoneNumber ||
            storeData?.contactPhone ||
            storeData?.mobileNumber ||
            storeData?.mobile ||
            storeData?.whatsappNumber ||
            contactData?.phoneNumber ||
            "",

          whatsappNumber:
            storeData?.whatsappNumber ||
            storeData?.phoneNumber ||
            storeData?.mobileNumber ||
            contactData?.phoneNumber ||
            "",

          storeAddress:
            storeData?.storeAddress ||
            storeData?.address ||
            contactData?.address ||
            "",

          city: storeData?.city || "",
          state: storeData?.state || "",
          country: storeData?.country || "",
          postalCode: storeData?.postalCode || "",

          websiteUrl: storeData?.websiteUrl || "",
          facebookUrl: storeData?.facebookUrl || "",
          instagramUrl: storeData?.instagramUrl || "",
          twitterUrl: storeData?.twitterUrl || "",
          youtubeUrl: storeData?.youtubeUrl || "",
          linkedinUrl: storeData?.linkedinUrl || "",

          googleMapsEmbedUrl: contactData?.googleMapsEmbedUrl || "",
          supportHours: contactData?.supportHours || "",
        });
      } catch (error) {
        console.error("Contact data fetch error:", error);
        setContactInfo({});
      }
    };

    fetchContactData();
  }, []);

  const fullAddress = useMemo(() => {
    return [
      contactInfo.storeAddress,
      contactInfo.city,
      contactInfo.state,
      contactInfo.postalCode,
      contactInfo.country,
    ]
      .filter(Boolean)
      .join(", ");
  }, [contactInfo]);

  const mapQuery = encodeURIComponent(fullAddress || contactInfo.companyName || "");

  const safeMapSrc =
  contactInfo.googleMapsEmbedUrl &&
  contactInfo.googleMapsEmbedUrl.includes("google.com/maps/embed")
    ? contactInfo.googleMapsEmbedUrl
    : fullAddress
    ? `https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`
    : "";


  const storeHours =
  contactInfo.supportHours?.length > 0
    ? contactInfo.supportHours
        .split("\n")
        .map((row) => {
          const [day, hours] = row.split(":");
          return {
            day: day?.trim(),
            hours: hours?.trim(),
          };
        })
    : defaultStoreHours;

  const quickContacts = [
    {
      icon: Phone,
      title: "Call Us",
      value: contactInfo.phoneNumber,
      link: `tel:${onlyDigits(contactInfo.phoneNumber)}`,
      color: "from-blue-500 to-cyan-600",
      desc: "Customer Support",
    },
    {
      icon: Mail,
      title: "Email Us",
      value: contactInfo.contactEmail,
      link: `mailto:${contactInfo.contactEmail}`,
      color: "from-purple-500 to-indigo-600",
      desc: "Send us an email",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: contactInfo.whatsappNumber,
      link: `https://wa.me/${onlyDigits(contactInfo.whatsappNumber)}`,
      color: "from-green-500 to-emerald-600",
      desc: "Chat with us instantly",
    },
  ].filter((item) => item.value);

  const socialLinks = [
    { icon: Facebook, link: contactInfo.facebookUrl, color: "bg-[#1877F2] hover:bg-[#1877F2]/90" },
    {
      icon: Instagram,
      link: contactInfo.instagramUrl,
      color: "bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
    },
    { icon: Twitter, link: contactInfo.twitterUrl, color: "bg-[#1DA1F2] hover:bg-[#1DA1F2]/90" },
    { icon: Youtube, link: contactInfo.youtubeUrl, color: "bg-[#FF0000] hover:bg-[#FF0000]/90" },
    { icon: Linkedin, link: contactInfo.linkedinUrl, color: "bg-[#0A66C2] hover:bg-[#0A66C2]/90" },
    { icon: Globe, link: contactInfo.websiteUrl, color: "bg-stone-800 hover:bg-stone-700" },
  ].filter((item) => item.link);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      setIsSent(true);
      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
        subject: "General Inquiry",
      });

      setTimeout(() => {
        setIsSent(false);
      }, 5000);
    } catch (error) {
      console.error("Send message error:", error);
      alert("Message send avvaledu. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

    
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50">
      {/* HERO SECTION SAME */}
      <div className="relative w-full bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, #fff 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>

        <div className="absolute top-10 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-xs uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-3 h-3 text-primary" />
            We'd Love to Hear From You
            <Sparkles className="w-3 h-3 text-primary" />
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-4 tracking-tight">
            Get in <span className="text-primary italic">Touch</span>
          </h1>
          <p className="font-body text-gray-200 text-sm md:text-base max-w-2xl mx-auto">
            Visit our LM Shopping Mall or drop us a message for any inquiries about our exclusive collections
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {quickContacts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {quickContacts.map((contact, idx) => (
              <a
                key={idx}
                href={contact.link}
                target={contact.link.startsWith("http") ? "_blank" : "_self"}
                rel="noreferrer"
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${contact.color} group-hover:scale-110 transition-transform`}
                  >
                    <contact.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-lg font-bold text-stone-800 mb-1">
                      {contact.title}
                    </h3>
                    <p className="text-primary font-medium">{contact.value}</p>
                    <p className="text-xs text-stone-500 mt-1">{contact.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </a>
            ))}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="w-full lg:w-5/12 space-y-6">
            {(contactInfo.companyName || fullAddress) && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-stone-100">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Building className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-heading text-xl text-stone-800">
                    {contactInfo.companyName || "Our Store"}
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      {contactInfo.companyName && (
                        <h4 className="font-semibold text-stone-800">
                          {contactInfo.companyName}
                        </h4>
                      )}

                      {fullAddress && (
                        <p className="text-sm text-stone-500 leading-relaxed">
                          {fullAddress}
                        </p>
                      )}

                      {fullAddress && (
                        <a
                          href={`https://maps.google.com/?q=${mapQuery}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                        >
                          Get Directions <ArrowRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-stone-100">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-heading text-xl text-stone-800">Store Hours</h2>
              </div>

              <div className="space-y-2">
                {storeHours.map((item, idx) => (
                  <div key={idx} className="flex justify-between gap-4 text-sm">
                    <span className="text-stone-600">{item.day}</span>
                    {item.hours && (
                      <span className="font-medium text-stone-800">{item.hours}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {socialLinks.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-heading text-xl text-stone-800">Connect With Us</h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((social, idx) => (
                    <a
                      key={idx}
                      href={social.link}
                      target="_blank"
                      rel="noreferrer"
                      className={`p-3 rounded-xl text-white transition-all hover:scale-110 hover:shadow-lg ${social.color}`}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-full lg:w-7/12">
            <div className="bg-white rounded-2xl shadow-xl border border-stone-100 p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6 border-b border-stone-200 pb-4">
                <button
                  type="button"
                  onClick={() => setActiveTab("message")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === "message"
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  Send Message
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("callback")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === "callback"
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  Request Callback
                </button>
              </div>

              <form className="space-y-5" onSubmit={handleSendMessage}>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1.5 uppercase tracking-wider">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Order Status">Order Status</option>
                    <option value="Custom Stitching">Custom Stitching</option>
                    <option value="Bulk Order">Bulk Order</option>
                    <option value="Press & Media">Press & Media</option>
                    <option value="Careers">Careers</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1.5 uppercase tracking-wider">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1.5 uppercase tracking-wider">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Your Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1.5 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1.5 uppercase tracking-wider">
                    {activeTab === "callback" ? "Best Time to Call" : "Your Message"}
                  </label>
                  <textarea
                    name="message"
                    rows="5"
                    placeholder={
                      activeTab === "callback"
                        ? "Let us know when to call you..."
                        : "How can we help you?"
                    }
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  ></textarea>
                </div>

                {isSent && (
                  <div className="bg-green-50 text-green-700 border border-green-200 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <div>
                      <p className="font-medium">Thank you! Your message has been sent.</p>
                      <p className="text-xs text-green-600 mt-0.5">We will get back to you soon.</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-60"
                >
                  <Send className="w-5 h-5" />
                  {isSubmitting
                    ? "Sending..."
                    : activeTab === "callback"
                    ? "Request Callback"
                    : "Send Message"}
                </button>
              </form>

              <p className="text-center text-xs text-stone-400 mt-4">
                We respect your privacy. Your information is safe with us.
              </p>
            </div>
          </div>
        </div>
      </div>

      {safeMapSrc && (
        <div className="w-full h-[450px] mt-8 relative overflow-hidden">
          <iframe
            title="Store Location"
            src={safeMapSrc}
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
          />


          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/60 via-black/20 to-transparent"></div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-left max-w-md mx-4 md:ml-16 border border-white/20 pointer-events-auto">
              <div className="w-16 h-16 mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <MapPin className="w-8 h-8 text-primary" />
              </div>

              <h3 className="font-heading text-2xl font-bold text-stone-800 mb-2">
                 Visit Our Store
              </h3>

              {fullAddress && (
                <p className="text-stone-600 mb-4 leading-relaxed">
                  {fullAddress}
                </p>
              )}

              {contactInfo.phoneNumber && (
                <div className="flex items-center gap-2 text-sm text-stone-500 mb-6">
                  <Phone className="w-4 h-4" />
                  {contactInfo.phoneNumber}
                </div>
              )}

              <div className="flex gap-3">
                {fullAddress && (
                  <a
                    href={`https://maps.google.com/?q=${mapQuery}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-primary text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    Get Directions
                  </a>
                )}

                {contactInfo.phoneNumber && (
                  <a
                    href={`tel:${onlyDigits(contactInfo.phoneNumber)}`}
                    className="flex-1 bg-white text-stone-700 px-6 py-3 rounded-full text-sm font-medium border border-stone-200 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Call Now
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;


// import React, { useState, useMemo } from "react";
// import {
//   MapPin,
//   Phone,
//   Mail,
//   Facebook,
//   Send,
//   CheckCircle2,
//   Instagram,
//   Clock,
//   Sparkles,
//   ChevronRight,
//   MessageCircle,
//   Globe,
//   ArrowRight,
//   Building,
//   Twitter,
//   Youtube,
//   Linkedin,
// } from "lucide-react";
// import { useEffect } from "react";
// import { getStoreInformation, getContactPage } from "@/services/contactService";

// const onlyDigits = (value = "") => String(value || "").replace(/\D/g, "");

// const defaultStoreHours = [
//   { day: "Monday - Saturday", hours: "10:00 AM - 8:00 PM" },
//   { day: "Sunday", hours: "11:00 AM - 6:00 PM" },
//   { day: "Festival Days", hours: "10:00 AM - 9:00 PM" },
// ];

// const Contact = () => {
  
//   const [isSent, setIsSent] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [activeTab, setActiveTab] = useState("message");
//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     message: "",
//     subject: "General Inquiry",
//   });

//   const [contactInfo, setContactInfo] = useState({
//   companyName: "",
//   contactEmail: "",
//   phoneNumber: "",
//   whatsappNumber: "",
//   storeAddress: "",
//   city: "",
//   state: "",
//   postalCode: "",
//   country: "",
//   facebookUrl: "",
//   instagramUrl: "",
//   twitterUrl: "",
//   youtubeUrl: "",
//   linkedinUrl: "",
//   googleMapsEmbedUrl: "",
//   supportHours: "",
//   mapBackgroundImage: "",
// });

// useEffect(() => {
//   const fetchContactData = async () => {
//     try {
//       const [storeInfo, contactPage] = await Promise.all([
//         getStoreInformation(),
//         getContactPage(),
//       ]);

//       setContactInfo({
//         companyName: storeInfo.companyName || "LM Shopping Mall",
//         contactEmail: contactPage.emailAddress || storeInfo.contactEmail || "",
//         phoneNumber: contactPage.phoneNumber || storeInfo.whatsappNumber || "",
//         whatsappNumber: storeInfo.whatsappNumber || contactPage.phoneNumber || "",
//         storeAddress: contactPage.address || storeInfo.storeAddress || "",
//         city: storeInfo.city || "",
//         state: storeInfo.state || "",
//         postalCode: storeInfo.postalCode || "",
//         country: storeInfo.country || "",
//         facebookUrl: storeInfo.facebookUrl || "",
//         instagramUrl: storeInfo.instagramUrl || "",
//         twitterUrl: storeInfo.twitterUrl || "",
//         youtubeUrl: storeInfo.youtubeUrl || "",
//         linkedinUrl: storeInfo.linkedinUrl || "",
//         googleMapsEmbedUrl: contactPage.googleMapsEmbedUrl || "",
//         supportHours: contactPage.supportHours || "",
//         mapBackgroundImage: contactPage.googleMapsEmbedUrl || "",
//       });
//     } catch (error) {
//       console.error("Failed to fetch contact data:", error);
//     }
//   };

//   fetchContactData();
// }, []);

//   const fullAddress = useMemo(
//     () =>
//       [
//         contactInfo.storeAddress,
//         contactInfo.city,
//         contactInfo.state,
//         contactInfo.postalCode,
//         contactInfo.country,
//       ]
//         .filter(Boolean)
//         .join(", "),
//     [contactInfo]
//   );

//   const mapQuery = encodeURIComponent(fullAddress);

//   const quickContacts = [
//     {
//       icon: Phone,
//       title: "Call Us",
//       value: contactInfo.phoneNumber,
//       link: `tel:${onlyDigits(contactInfo.phoneNumber)}`,
//       color: "from-blue-500 to-cyan-600",
//       desc: "24/7 Customer Support",
//     },
//     {
//       icon: Mail,
//       title: "Email Us",
//       value: contactInfo.contactEmail,
//       link: `mailto:${contactInfo.contactEmail}`,
//       color: "from-purple-500 to-indigo-600",
//       desc: "Response within 2 hours",
//     },
//     {
//       icon: MessageCircle,
//       title: "WhatsApp",
//       value: contactInfo.whatsappNumber,
//       link: `https://wa.me/${onlyDigits(contactInfo.whatsappNumber)}`,
//       color: "from-green-500 to-emerald-600",
//       desc: "Chat with us instantly",
//     },
//   ];

//   const socialLinks = [
//     { icon: Facebook, link: contactInfo.facebookUrl, color: "bg-[#1877F2] hover:bg-[#1877F2]/90" },
//     {
//       icon: Instagram,
//       link: contactInfo.instagramUrl,
//       color: "bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
//     },
//     { icon: Twitter, link: contactInfo.twitterUrl, color: "bg-[#1DA1F2] hover:bg-[#1DA1F2]/90" },
//     { icon: Youtube, link: contactInfo.youtubeUrl, color: "bg-[#FF0000] hover:bg-[#FF0000]/90" },
//     { icon: Linkedin, link: contactInfo.linkedinUrl, color: "bg-[#0A66C2] hover:bg-[#0A66C2]/90" },
//   ].filter((item) => item.link);

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setIsSent(true);
//     setFormData({
//       name: "",
//       phone: "",
//       email: "",
//       message: "",
//       subject: "General Inquiry",
//     });
//     setTimeout(() => setIsSent(false), 5000);
//     setIsSubmitting(false);
//   };

  

//   return (
//     <div className="w-full min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50">
//       {/* Black hero banner */}
//       <div className="relative w-full bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 py-16 md:py-24 overflow-hidden">
//         <div className="absolute inset-0 opacity-[0.08]">
//           <div
//             className="absolute inset-0"
//             style={{
//               backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
//               backgroundSize: "32px 32px",
//             }}
//           />
//         </div>
//         <div className="absolute top-0 left-0 w-72 h-72 bg-amber-700/20 rounded-full blur-3xl" />
//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-stone-600/10 rounded-full blur-3xl" />

//         <div className="container mx-auto px-4 relative z-10 text-center">
//           <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 text-[10px] md:text-xs uppercase tracking-[0.25em] px-5 py-2 rounded-full mb-6 border border-white/10">
//             <Sparkles className="w-3 h-3 text-primary" />
//             We'd Love to Hear From You
//             <Sparkles className="w-3 h-3 text-primary" />
//           </span>
//           <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-4 tracking-tight">
//             Get in <span className="text-primary italic">Touch</span>
//           </h1>
//           <p className="font-body text-gray-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
//             Visit our showroom in Nellore or drop us a message for any inquiries about our
//             exclusive collections
//           </p>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-12">
//         {/* Quick contact cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
//           {quickContacts.map((contact, idx) => (
//             <a
//               key={idx}
//               href={contact.link}
//               target={contact.link.startsWith("http") ? "_blank" : "_self"}
//               rel="noreferrer"
//               className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100"
//             >
//               <div className="flex items-start gap-4">
//                 <div
//                   className={`p-3 rounded-xl bg-gradient-to-br ${contact.color} group-hover:scale-110 transition-transform shrink-0`}
//                 >
//                   <contact.icon className="w-6 h-6 text-white" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="font-heading text-lg font-bold text-stone-800 mb-1">
//                     {contact.title}
//                   </h3>
//                   <p className="text-primary font-medium text-sm truncate">{contact.value}</p>
//                   <p className="text-xs text-stone-500 mt-1">{contact.desc}</p>
//                 </div>
//                 <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
//               </div>
//             </a>
//           ))}
//         </div>

//         {/* Store info + form */}
//         <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
//           <div className="w-full lg:w-5/12 space-y-6">
//             <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
//               <div className="flex items-center gap-3 mb-4 pb-3 border-b border-stone-100">
//                 <div className="p-2 bg-primary/10 rounded-lg">
//                   <Building className="w-5 h-5 text-primary" />
//                 </div>
//                 <h2 className="font-heading text-xl text-stone-800">Our Flagship Store</h2>
//               </div>
//               <div className="flex items-start gap-3">
//                 <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
//                 <div>
//                   <h4 className="font-semibold text-stone-800">{contactInfo.companyName}</h4>
//                   <p className="text-sm text-stone-500 leading-relaxed mt-1">{fullAddress}</p>
//                   <a
//                     href={`https://maps.google.com/?q=${mapQuery}`}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-3 font-semibold"
//                   >
//                     Get Directions <ArrowRight className="w-3 h-3" />
//                   </a>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
//               <div className="flex items-center gap-3 mb-4 pb-3 border-b border-stone-100">
//                 <div className="p-2 bg-primary/10 rounded-lg">
//                   <Clock className="w-5 h-5 text-primary" />
//                 </div>
//                 <h2 className="font-heading text-xl text-stone-800">Store Hours</h2>
//               </div>
//               <div className="space-y-2 mb-4">
//                 {(contactInfo.supportHours
//                   ? [{ day: "Store Timings", hours: contactInfo.supportHours }]
//                   : defaultStoreHours
//                 ).map((item, idx) => (
//                   <div key={idx} className="flex justify-between text-sm">
//                     <span className="text-stone-600">{item.day}</span>
//                     <span className="font-medium text-stone-800">{item.hours}</span>
//                   </div>
//                 ))}
                
//               </div>
//               <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
//                 <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
//                 <span className="text-sm text-green-700 font-medium">
//                   Open now — Closing at 8:00 PM
//                 </span>
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="p-2 bg-primary/10 rounded-lg">
//                   <Globe className="w-5 h-5 text-primary" />
//                 </div>
//                 <h2 className="font-heading text-xl text-stone-800">Connect With Us</h2>
//               </div>
//               <div className="flex flex-wrap gap-2 mb-3">
//                 {socialLinks.map((social, idx) => (
//                   <a
//                     key={idx}
//                     href={social.link}
//                     target="_blank"
//                     rel="noreferrer"
//                     className={`p-3 rounded-xl text-white transition-all hover:scale-110 hover:shadow-lg ${social.color}`}
//                   >
//                     <social.icon className="w-5 h-5" />
//                   </a>
//                 ))}
//               </div>
//               <p className="text-xs text-stone-500">
//                 Follow us for exclusive offers, new arrivals & styling tips
//               </p>
//             </div>
//           </div>

//           <div className="w-full lg:w-7/12">
//             <div className="bg-white rounded-2xl shadow-xl border border-stone-100 p-6 md:p-8">
//               <div className="flex items-center gap-2 mb-6 border-b border-stone-200 pb-4">
//                 <button
//                   type="button"
//                   onClick={() => setActiveTab("message")}
//                   className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
//                     activeTab === "message"
//                       ? "bg-primary text-white shadow-md shadow-primary/20"
//                       : "bg-stone-100 text-stone-600 hover:bg-stone-200"
//                   }`}
//                 >
//                   Send Message
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setActiveTab("callback")}
//                   className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
//                     activeTab === "callback"
//                       ? "bg-primary text-white shadow-md shadow-primary/20"
//                       : "bg-stone-100 text-stone-600 hover:bg-stone-200"
//                   }`}
//                 >
//                   Request Callback
//                 </button>
//               </div>

//               <form className="space-y-5" onSubmit={handleSendMessage}>
//                 <div>
//                   <label className="block text-xs font-medium text-stone-700 mb-1.5 uppercase tracking-wider">
//                     Subject
//                   </label>
//                   <select
//                     name="subject"
//                     value={formData.subject}
//                     onChange={handleInputChange}
//                     className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
//                   >
//                     <option value="General Inquiry">General Inquiry</option>
//                     <option value="Order Status">Order Status</option>
//                     <option value="Custom Stitching">Custom Stitching</option>
//                     <option value="Bulk Order">Bulk Order</option>
//                     <option value="Press & Media">Press & Media</option>
//                     <option value="Careers">Careers</option>
//                   </select>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                   <div>
//                     <label className="block text-xs font-medium text-stone-700 mb-1.5 uppercase tracking-wider">
//                       Full Name
//                     </label>
//                     <input
//                       type="text"
//                       name="name"
//                       placeholder="Your Name"
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-medium text-stone-700 mb-1.5 uppercase tracking-wider">
//                       Phone Number
//                     </label>
//                     <input
//                       type="tel"
//                       name="phone"
//                       placeholder="Your Phone Number"
//                       value={formData.phone}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-xs font-medium text-stone-700 mb-1.5 uppercase tracking-wider">
//                     Email Address
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     placeholder="you@example.com"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-xs font-medium text-stone-700 mb-1.5 uppercase tracking-wider">
//                     {activeTab === "callback" ? "Best Time to Call" : "Your Message"}
//                   </label>
//                   <textarea
//                     name="message"
//                     rows="5"
//                     placeholder={
//                       activeTab === "callback"
//                         ? "Let us know when to call you..."
//                         : "How can we help you?"
//                     }
//                     value={formData.message}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
//                   />
//                 </div>

//                 {isSent && (
//                   <div className="bg-green-50 text-green-700 border border-green-200 p-4 rounded-xl flex items-start gap-3">
//                     <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
//                     <div>
//                       <p className="font-medium">Thank you! Your message has been sent.</p>
//                       <p className="text-xs text-green-600 mt-0.5">We will get back to you soon.</p>
//                     </div>
//                   </div>
//                 )}

//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl active:scale-[0.98] disabled:opacity-60"
//                 >
//                   <Send className="w-5 h-5" />
//                   {isSubmitting
//                     ? "Sending..."
//                     : activeTab === "callback"
//                     ? "Request Callback"
//                     : "Send Message"}
//                 </button>
//               </form>

//               <p className="text-center text-xs text-stone-400 mt-4">
//                 We respect your privacy. Your information is safe with us.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Map section with vintage map background */}
//       <div className="w-full relative py-20 md:py-28 bg-stone-100">
//   {contactInfo.googleMapsEmbedUrl && (
//     <iframe
//       title="Store Location"
//       src={contactInfo.googleMapsEmbedUrl}
//       className="absolute inset-0 w-full h-full border-0"
//       loading="lazy"
//       allowFullScreen
//     />
//   )}

//   <div className="absolute inset-0 bg-stone-900/30" />

//   <div className="container mx-auto px-4 relative z-10 flex justify-center">
//     {/* mee existing white visit store card same ga unchandi */}
//           <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 text-center max-w-lg w-full border border-white/50">
//             <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
//               <MapPin className="w-7 h-7 text-primary" />
//             </div>
//             <h3 className="font-heading text-2xl md:text-3xl font-bold text-stone-800 mb-3">
//               Visit Our Store
//             </h3>
//             <p className="text-stone-600 text-sm leading-relaxed mb-5">{fullAddress}</p>
//             <div className="flex items-center justify-center gap-4 text-sm text-stone-500 mb-6 flex-wrap">
//               <span className="flex items-center gap-1.5">
//                 <Clock className="w-4 h-4 text-primary" />
//                 10AM – 8PM
//               </span>
//               <span className="hidden sm:block w-px h-4 bg-stone-300" />
//               <span className="flex items-center gap-1.5">
//                 <Phone className="w-4 h-4 text-primary" />
//                 {contactInfo.phoneNumber}
//               </span>
//             </div>
//             <div className="flex flex-col sm:flex-row gap-3 justify-center">
//               <a
//                 href={
//                   contactInfo.googleMapsEmbedUrl ||
//                   `https://maps.google.com/?q=${mapQuery}`
//                 }
//                 target="_blank"
//                 rel="noreferrer"
//                 className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
//               >
//                 <MapPin className="w-4 h-4" />
//                 Get Directions
//               </a>
//               <a
//                 href={`tel:${onlyDigits(contactInfo.phoneNumber)}`}
//                 className="inline-flex items-center justify-center gap-2 bg-white text-stone-700 px-6 py-3 rounded-full text-sm font-semibold border-2 border-stone-200 hover:border-primary hover:text-primary transition-all"
//               >
//                 <Phone className="w-4 h-4" />
//                 Call Now
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Contact;
