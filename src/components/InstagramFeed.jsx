import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Instagram,
  Play,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

/*
  Videos ni ee folder lo pettandi:

  public/assets/instagram/reel-1.mp4
  public/assets/instagram/reel-2.mp4
  public/assets/instagram/reel-3.mp4
  ...

  New video add cheyyalante array lo new object add cheyyandi.
*/

const instagramPosts = [
  {
    id: 1,
    videoSrc: "/instagram/reel-1.mp4",
    instagramUrl: "https://www.instagram.com/lmshowroom_official/",
    username: "lmshowroom_official",
    caption: "Latest fabric collection reel.",
    date: "July 11, 2026",
  },
  {
    id: 2,
    videoSrc: "/instagram/reel-2.mp4",
    instagramUrl: "https://www.instagram.com/lmshowroom_official/",
    username: "lmshowroom_official",
    caption: "New arrivals collection.",
    date: "July 10, 2026",
  },
  {
    id: 3,
    videoSrc: "/instagram/reel-3.mp4",
    instagramUrl: "https://www.instagram.com/lmshowroom_official/",
    username: "lmshowroom_official",
    caption: "Premium handwork fabrics.",
    date: "July 9, 2026",
  },
  {
    id: 4,
    videoSrc: "/instagram/reel-4.mp4",
    instagramUrl: "https://www.instagram.com/lmshowroom_official/",
    username: "lmshowroom_official",
    caption: "Trending styles and designs.",
    date: "July 8, 2026",
  },
  {
    id: 5,
    videoSrc: "/instagram/reel-5.mp4",
    instagramUrl: "https://www.instagram.com/lmshowroom_official/",
    username: "lmshowroom_official",
    caption: "Exclusive fabric collection.",
    date: "July 7, 2026",
  },
//   {
//     id: 6,
//     videoSrc: "/assets/instagram/reel-6.mp4",
//     instagramUrl: "https://www.instagram.com/lmshowroom_official/",
//     username: "lmshowroom_official",
//     caption: "Latest showroom collection.",
//     date: "July 6, 2026",
//   },
//   {
//     id: 7,
//     videoSrc: "/assets/instagram/reel-7.mp4",
//     instagramUrl: "https://www.instagram.com/lmshowroom_official/",
//     username: "lmshowroom_official",
//     caption: "Designer fabrics reel.",
//     date: "July 5, 2026",
//   },
//   {
//     id: 8,
//     videoSrc: "/assets/instagram/reel-8.mp4",
//     instagramUrl: "https://www.instagram.com/lmshowroom_official/",
//     username: "lmshowroom_official",
//     caption: "Popular Instagram reel.",
//     date: "July 4, 2026",
//   },
//   {
//     id: 9,
//     videoSrc: "/assets/instagram/reel-9.mp4",
//     instagramUrl: "https://www.instagram.com/lmshowroom_official/",
//     username: "lmshowroom_official",
//     caption: "Fresh styles reel.",
//     date: "July 3, 2026",
//   },
//   {
//     id: 10,
//     videoSrc: "/assets/instagram/reel-10.mp4",
//     instagramUrl: "https://www.instagram.com/lmshowroom_official/",
//     username: "lmshowroom_official",
//     caption: "Premium collection showcase.",
//     date: "July 2, 2026",
//   },
];

const InstagramFeed = ({
  posts = instagramPosts,
  desktopVisible = 5,
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [muted, setMuted] = useState(true);

  const safePosts = useMemo(
    () =>
      (posts || []).filter(
        (post) => post?.id && post?.videoSrc
      ),
    [posts]
  );

  const visiblePosts = useMemo(() => {
    if (!safePosts.length) return [];

    const count = Math.min(
      desktopVisible,
      safePosts.length
    );

    return Array.from(
      { length: count },
      (_, offset) => {
        const actualIndex =
          (startIndex + offset) % safePosts.length;

        return {
          ...safePosts[actualIndex],
          actualIndex,
        };
      }
    );
  }, [safePosts, startIndex, desktopVisible]);

  const selectedPost =
    selectedIndex === null
      ? null
      : safePosts[selectedIndex];

  const goPreviousGrid = () => {
    if (!safePosts.length) return;

    setStartIndex(
      (current) =>
        (current - 1 + safePosts.length) %
        safePosts.length
    );
  };

  const goNextGrid = () => {
    if (!safePosts.length) return;

    setStartIndex(
      (current) =>
        (current + 1) % safePosts.length
    );
  };

  const closeModal = () => {
    setSelectedIndex(null);
    setMuted(true);
  };

  const goPreviousModal = () => {
    if (!safePosts.length) return;

    setMuted(true);

    setSelectedIndex(
      (current) =>
        (current - 1 + safePosts.length) %
        safePosts.length
    );
  };

  const goNextModal = () => {
    if (!safePosts.length) return;

    setMuted(true);

    setSelectedIndex(
      (current) =>
        (current + 1) % safePosts.length
    );
  };

  useEffect(() => {
    if (selectedIndex === null) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }

      if (event.key === "ArrowLeft") {
        goPreviousModal();
      }

      if (event.key === "ArrowRight") {
        goNextModal();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [selectedIndex, safePosts.length]);

  if (!safePosts.length) {
    return null;
  }

  return (
    <>
      <section className="w-full bg-white py-10 md:py-14">
        <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8">
          <div className="mb-7 flex items-center justify-center gap-3 text-center md:mb-9">
            <Instagram className="h-7 w-7 text-primary md:h-9 md:w-9" />

            <h2 className="font-heading text-2xl font-medium tracking-wide text-stone-900 sm:text-3xl md:text-5xl">
              FOLLOW US ON{" "}
              <span className="bg-gradient-to-r from-blue-600 via-fuchsia-600 to-rose-500 bg-clip-text text-transparent">
                INSTAGRAM
              </span>
            </h2>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {visiblePosts.map((post) => (
                <button
                  key={`${post.id}-${post.actualIndex}`}
                  type="button"
                  onClick={() => {
                    setMuted(true);

                    setSelectedIndex(
                      post.actualIndex
                    );
                  }}
                  className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-black text-left shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  aria-label={`Open Instagram video ${
                    post.actualIndex + 1
                  }`}
                >
                  <video
                    src={post.videoSrc}
                    muted
                    // loop
                    // autoPlay
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-black/5 transition group-hover:bg-black/20" />

                  <span className="absolute left-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur">
                    <Play className="h-4 w-4 fill-current" />
                  </span>

                  <span className="absolute bottom-3 right-3 inline-flex h-8 w-8 translate-y-2 items-center justify-center rounded-full bg-white/90 text-primary opacity-0 shadow transition group-hover:translate-y-0 group-hover:opacity-100">
                    <Instagram className="h-4 w-4" />
                  </span>
                </button>
              ))}
            </div>

            {safePosts.length >
              visiblePosts.length && (
              <>
                <button
                  type="button"
                  onClick={goPreviousGrid}
                  aria-label="Previous Instagram videos"
                  className="absolute left-0 top-1/2 z-10 flex h-11 w-11 -translate-x-1/3 -translate-y-1/2 items-center justify-center rounded-full bg-white text-stone-800 shadow-lg transition hover:bg-primary hover:text-white"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                <button
                  type="button"
                  onClick={goNextGrid}
                  aria-label="Next Instagram videos"
                  className="absolute right-0 top-1/2 z-10 flex h-11 w-11 translate-x-1/3 -translate-y-1/2 items-center justify-center rounded-full bg-white text-stone-800 shadow-lg transition hover:bg-primary hover:text-white"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {selectedPost && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-label="Instagram video viewer"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              closeModal();
            }
          }}
        >
          <button
            type="button"
            onClick={closeModal}
            aria-label="Close Instagram video"
            className="fixed right-4 top-4 z-[220] flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-primary"
          >
            <X className="h-7 w-7" />
          </button>

          {safePosts.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPreviousModal}
                aria-label="Previous Instagram video"
                className="fixed left-2 top-1/2 z-[220] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-primary sm:left-5"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>

              <button
                type="button"
                onClick={goNextModal}
                aria-label="Next Instagram video"
                className="fixed right-2 top-1/2 z-[220] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-primary sm:right-5"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          <div className="grid max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
            <div className="relative flex min-h-[45vh] items-center justify-center overflow-hidden bg-black lg:min-h-[78vh]">
              <video
                key={selectedPost.id}
                src={selectedPost.videoSrc}
                controls
                autoPlay
                muted={muted}
                playsInline
                preload="metadata"
                className="max-h-[78vh] w-full object-contain"
              />

              <button
                type="button"
                onClick={() =>
                  setMuted(
                    (current) => !current
                  )
                }
                className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur"
                aria-label={
                  muted
                    ? "Unmute video"
                    : "Mute video"
                }
              >
                {muted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="flex min-h-0 flex-col bg-white">
              <div className="flex items-center gap-3 border-b border-stone-200 px-5 py-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-fuchsia-600 to-indigo-600 text-white">
                  <Instagram className="h-6 w-6" />
                </span>

                <div className="min-w-0">
                  <p className="truncate font-semibold text-stone-900">
                    {selectedPost.username ||
                      "Instagram"}
                  </p>

                  {selectedPost.date && (
                    <p className="text-xs text-stone-400">
                      {selectedPost.date}
                    </p>
                  )}
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                <p className="whitespace-pre-wrap text-sm leading-7 text-stone-600">
                  {selectedPost.caption ||
                    "View this video on Instagram."}
                </p>
              </div>

              {selectedPost.instagramUrl && (
                <div className="border-t border-stone-200 p-4">
                  <a
                    href={
                      selectedPost.instagramUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    View on Instagram
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstagramFeed;