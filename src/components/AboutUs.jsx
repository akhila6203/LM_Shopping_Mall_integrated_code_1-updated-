import { useEffect, useState } from "react";
import { getAboutUs } from "@/services/aboutService";
import { getImageUrl } from "@/api/axiosClient";

const AboutUs = () => {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    const loadAbout = async () => {
      try {
        const data = await getAboutUs();

        setAbout({
          title: data?.title || "About Us",
          content: data?.content || "",
          image: data?.image ? getImageUrl(data.image) : "",
        });
      } catch (error) {
        console.error("About us fetch error:", error);
      }
    };

    loadAbout();
  }, []);

  if (!about) return null;

  return (
    <main className="min-h-screen bg-background">
      <section className="pt-24 pb-16 md:pt-28 md:pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 items-center">
            {about.image && (
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={about.image}
                  alt={about.title}
                  className="w-full h-[320px] md:h-[480px] object-cover"
                />
              </div>
            )}

            <div>
              <p className="text-primary text-xs md:text-sm uppercase tracking-widest font-medium mb-3">
                About US
              </p>

              <h1 className="text-2xl md:text-4xl font-heading font-semibold text-foreground mb-5">
                {about.title}
              </h1>

              <div
                className="text-muted-foreground text-base md:text-lg leading-8 font-body"
                dangerouslySetInnerHTML={{ __html: about.content }}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;