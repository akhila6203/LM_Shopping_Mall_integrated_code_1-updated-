import React from "react";
import {
  Users,
  Globe2,
  ShieldCheck,
  Shirt,
  Tags,
} from "lucide-react";

const trustItems = [
  {
    icon: Users,
    line1: "Trusted by 80k+",
    line2: "Customers",
  },
  {
    icon: Globe2,
    line1: "Worldwide",
    line2: "Delivery",
  },
  {
    icon: ShieldCheck,
    line1: "Genuine Quality",
    line2: "",
  },
  {
    icon: Shirt,
    line1: "5000+ Styles",
    line2: "",
  },
  {
    icon: Tags,
    line1: "New Drops Daily",
    line2: "",
  },
];

const TrustStrip = () => {
  const scrollingItems = [
    ...trustItems,
    ...trustItems,
    ...trustItems,
    ...trustItems,
  ];

  return (
    <section
      className="
        w-full
        overflow-hidden
        bg-white
        border-t
        border-gray-100
        border-b-2
        border-primary
      "
      aria-label="Store benefits"
    >
      <div className="w-full overflow-hidden">
        <div
          className="
            trust-strip-track
            flex
            w-max
            items-center
            will-change-transform
          "
        >
          {scrollingItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={`${item.line1}-${index}`}
                aria-hidden={index >= trustItems.length}
                className="
                  flex
                  min-w-[125px]
                  w-[125px]
                  flex-shrink-0
                  flex-col
                  items-center
                  justify-center
                  gap-1
                  px-2
                  py-3
                  text-center

                  sm:min-w-[135px]
                  sm:w-[135px]

                  md:min-w-[145px]
                  md:w-[145px]

                  lg:min-w-[150px]
                  lg:w-[150px]
                "
              >
                <Icon
                  strokeWidth={1.7}
                  aria-hidden="true"
                  className="
                    h-7
                    w-7
                    text-primary

                    sm:h-8
                    sm:w-8

                    lg:h-9
                    lg:w-9
                  "
                />

                <div
                  className="
                    flex
                    flex-col
                    items-center
                    text-[9px]
                    font-bold
                    leading-[1.05]
                    text-gray-800

                    sm:text-[10px]
                    lg:text-[11px]
                  "
                >
                  <span>{item.line1}</span>

                  {item.line2 && (
                    <span>{item.line2}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .trust-strip-track {
          animation: trustStripMarquee 20s linear infinite;
        }

        .trust-strip-track:hover {
          animation-play-state: paused;
        }

        @keyframes trustStripMarquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(
              calc(-150px * ${trustItems.length})
            );
          }
        }

        @media (max-width: 1024px) {
          .trust-strip-track {
            animation-duration: 18s;
          }

          @keyframes trustStripMarquee {
            from {
              transform: translateX(0);
            }

            to {
              transform: translateX(
                calc(-145px * ${trustItems.length})
              );
            }
          }
        }

        @media (max-width: 768px) {
          .trust-strip-track {
            animation-duration: 16s;
          }

          @keyframes trustStripMarquee {
            from {
              transform: translateX(0);
            }

            to {
              transform: translateX(
                calc(-135px * ${trustItems.length})
              );
            }
          }
        }

        @media (max-width: 640px) {
          .trust-strip-track {
            animation-duration: 14s;
          }

          @keyframes trustStripMarquee {
            from {
              transform: translateX(0);
            }

            to {
              transform: translateX(
                calc(-125px * ${trustItems.length})
              );
            }
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .trust-strip-track {
            animation-play-state: paused;
          }
        }
      `}</style>
    </section>
  );
};

export default TrustStrip;