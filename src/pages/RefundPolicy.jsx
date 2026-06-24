import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Sparkles } from "lucide-react";
import { getContentPage } from "@/services/contentService";

const RefundPolicy = () => {
  const [data, setData] = useState({ title: "", content: "" });

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getContentPage("refund-policy");
        setData(res || {});
      } catch (error) {
        console.error("Refund Policy fetch error:", error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="w-full bg-cream min-h-screen">
      <section className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-10 md:py-12">
          <div className="flex items-center gap-2 text-xs text-stone-400 mb-4">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary font-semibold">Refund Policy</span>
          </div>

          <div className="text-center">
            <span className="inline-flex items-center gap-2 bg-white/10 text-cream text-xs uppercase tracking-[0.3em] px-3 py-1 rounded-full border border-white/20 mb-3">
              <Sparkles className="w-3 h-3 text-primary" /> Policy
            </span>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
              {data.title || "Refund Policy"}
            </h1>
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

export default RefundPolicy;