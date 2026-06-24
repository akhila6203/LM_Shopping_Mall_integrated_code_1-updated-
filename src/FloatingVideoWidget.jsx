import { useState, useRef, useEffect } from "react";
import {
  Play,
  X,
  Minimize2,
  Maximize2,
  ShoppingBag,
  ArrowRight,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";

const FloatingVideoWidget = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(0);

  const videoRef = useRef(null);

  // 🎥 ADD YOUR 3 VIDEOS HERE
  const videos = ["/video1.mp4", "/video.mp4", "/video2.mp4"];

  // ✅ AUTO PLAY ON LOAD
 useEffect(() => {
  if (videoRef.current) {
    videoRef.current.play().catch(() => {});
  }
}, [currentVideo]);

  // 🔥 AUTO NEXT VIDEO
  const handleVideoEnd = () => {
    setCurrentVideo((prev) => (prev + 1) % videos.length);
  };

  if (isClosed) return null;

  const handleMinimize = (e) => {
    e?.stopPropagation();
    setIsExpanded(false);
    setIsFullScreen(false);
    videoRef.current?.pause();
  };

  const handleMaximize = () => {
    setIsExpanded(true);
    videoRef.current?.play();
  };

  const toggleFullScreen = (e) => {
    e?.stopPropagation();
    setIsFullScreen(!isFullScreen);
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <>
      {/* BACKDROP */}
      {isFullScreen && (
        <div
          className="fixed inset-0 bg-black/90 z-[90]"
          onClick={handleMinimize}
        />
      )}

      <div
        className={`fixed z-[100] transition-all duration-500 ${
          !isExpanded
            ? "bottom-6 right-6"
            : isFullScreen
            ? "inset-0 flex items-center justify-center p-4"
            : "bottom-4 right-4"
        }`}
      >
        {!isExpanded ? (
          /* 🔴 SMALL VIDEO BUBBLE */
          <div
            onClick={handleMaximize}
            className="relative w-14 h-14 rounded-full overflow-hidden cursor-pointer shadow-lg"
          >
            <video
              src={videos[currentVideo]}
              muted
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-orange-500 rounded-full p-2 shadow-md">
                <Play className="w-3 h-3 text-white fill-white" />
              </div>
            </div>
          </div>
        ) : (
          /* 🔥 VIDEO PLAYER */
          <div
            className={`relative bg-black overflow-hidden rounded-xl shadow-xl ${
              isFullScreen
                ? "w-full max-w-[350px] h-[80vh]"
                : "w-[180px] h-[300px]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 🔝 CONTROLS */}
            <div className="absolute top-2 right-2 z-20 flex gap-1">
              {/* MUTE */}
              <button
                onClick={toggleMute}
                className="p-1 bg-black/60 rounded-full text-white"
              >
                {isMuted ? (
                  <VolumeX className="w-3 h-3" />
                ) : (
                  <Volume2 className="w-3 h-3" />
                )}
              </button>

              {/* FULLSCREEN */}
              <button
                onClick={toggleFullScreen}
                className="p-1 bg-black/60 rounded-full text-white"
              >
                {isFullScreen ? (
                  <Minimize2 className="w-3 h-3" />
                ) : (
                  <Maximize2 className="w-3 h-3" />
                )}
              </button>

              {/* MINIMIZE */}
              <button
                onClick={handleMinimize}
                className="p-1 bg-black/60 rounded-full text-white"
              >
                <Minimize2 className="w-3 h-3" />
              </button>

              {/* CLOSE */}
              <button
                onClick={() => setIsClosed(true)}
                className="p-1 bg-black/60 rounded-full text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* 🔥 30% OFF BADGE */}
            <div className="absolute top-8 left-2 z-20 bg-black/70 px-2 py-1 rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3 text-orange-500" />
              <span className="text-white text-[10px] font-semibold">
                30% OFF
              </span>
            </div>

            {/* 🎥 VIDEO */}
          <video
  ref={videoRef}
  src={videos[0]} // start from first
  autoPlay
  muted={isMuted}
  playsInline
  preload="auto"
  className="w-full h-full object-cover"
  onEnded={() => {
    const nextIndex = (currentVideo + 1) % videos.length;

    // 🔥 directly change src (NO REACT DELAY)
    if (videoRef.current) {
      videoRef.current.src = videos[nextIndex];
      videoRef.current.play().catch(() => {});
    }

    setCurrentVideo(nextIndex);
  }}
/>
            {/* 🛒 CTA BUTTON */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center">
              <button
                onClick={() => (window.location.href = "/shop")}
                className="bg-orange-500 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md"
              >
                <ShoppingBag className="w-3 h-3" />
                Shop
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FloatingVideoWidget;