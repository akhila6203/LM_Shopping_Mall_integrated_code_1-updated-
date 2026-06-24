import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Sparkles } from "lucide-react";
import { getContentPage } from "@/services/contentService";

const PrivacyPolicy = () => {
  const [data, setData] = useState({ title: "", content: "" });

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getContentPage("privacy-policy");
        setData(res || {});
      } catch (error) {
        console.error("Privacy Policy fetch error:", error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="w-full bg-cream min-h-screen">
      <section className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 overflow-hidden">
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

        <div className="absolute top-10 left-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-5 right-10 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-10 md:py-12">
          <div className="flex items-center gap-2 text-xs text-stone-400 mb-4">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary font-semibold">Privacy Policy</span>
          </div>

          <div className="text-center">
            <span className="inline-flex items-center gap-2 bg-white/10 text-cream text-xs uppercase tracking-[0.3em] px-3 py-1 rounded-full border border-white/20 mb-3">
              <Sparkles className="w-3 h-3 text-primary" />
              Store Policy
            </span>

            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
              {data.title || "Privacy Policy"}
            </h1>

            <p className="text-cream/70 text-base max-w-2xl mx-auto mt-3">
              Learn how we collect, use, and protect your information.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pt-12 pb-24">
        <div className="bg-white border border-stone-100 rounded-2xl shadow-sm p-6 md:p-10">
          <div
            className="text-stone-600 text-sm md:text-base leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{
              __html: data.content || "<p>No content available.</p>",
            }}
          />
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;