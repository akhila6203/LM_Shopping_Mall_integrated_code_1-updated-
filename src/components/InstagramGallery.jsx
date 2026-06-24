import { Instagram } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import insta1 from "@/assets/insta-1.jpg";
import insta2 from "@/assets/insta-2.jpg";
import insta3 from "@/assets/insta-3.jpg";
import insta4 from "@/assets/insta-4.jpg";
import insta5 from "@/assets/insta-5.jpg";
import insta6 from "@/assets/insta-6.jpg";

const photos = [
  { src: insta1, alt: "Elegant saree in sunlit courtyard", tall: true },
  { src: insta2, alt: "Artisan holding fabric rolls", tall: false },
  { src: insta3, alt: "Jewelry and flowers flat lay", tall: true },
  { src: insta4, alt: "Street style in a colorful bazaar", tall: false },
  { src: insta5, alt: "Purple silk saree in boutique", tall: true },
  { src: insta6, alt: "Traditional handloom weaving", tall: false },
];

const InstagramGallery = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    // Spacing fixed here
    <section id="gallery" className="pt-8 pb-6 md:pt-10 md:pb-10 scroll-mt-20" ref={ref}>
      <div className="container">
        <div className={`text-center mb-12 ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          <p className="text-primary text-sm uppercase tracking-widest font-medium mb-2">Follow Our Journey</p>
          <h2 className="text-3xl md:text-4xl font-heading mb-3">@VastraTextiles</h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm">
            Tag us in your photos for a chance to be featured
          </p>
        </div>

        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {photos.map((photo, i) => (
            <div
              key={i}
              className={`break-inside-avoid group relative overflow-hidden rounded-lg cursor-pointer ${isVisible ? `animate-fade-up stagger-${(i % 5) + 1}` : "opacity-0"}`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                width={640}
                height={photo.tall ? 800 : 640}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors duration-500 flex items-center justify-center">
                <Instagram className="w-8 h-8 text-primary-foreground opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100" />
              </div>
            </div>
          ))}
        </div>

        <div className={`text-center mt-10 ${isVisible ? "animate-fade-up" : "opacity-0"}`}>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline underline-offset-4 transition-all"
          >
            <Instagram className="w-5 h-5" />
            Follow us on Instagram
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstagramGallery;