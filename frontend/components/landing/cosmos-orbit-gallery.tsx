"use client";

import dynamic from "next/dynamic";

const CosmosOrbitGalleryCanvas = dynamic(
  () => import("./cosmos-orbit-gallery-canvas"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="w-8 h-8 animate-spin rounded-full border-4 border-white/20 border-t-white" />
      </div>
    ),
  }
);

export function CosmosOrbitGallery() {
  return (
    <section className="relative w-full h-[80vh] sm:h-screen bg-black overflow-hidden border-t border-white/5">
      {/* Import the Instrument Serif Google Font */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
        .font-instrument-serif {
          font-family: 'Instrument Serif', serif;
        }
      `}} />

      {/* Headline (absolute overlay) */}
      <div className="absolute top-16 sm:top-24 left-0 right-0 z-10 p-6 pointer-events-none">
        <h1 className="max-w-[850px] mx-auto text-white text-center font-instrument-serif px-6 text-3xl sm:text-5xl md:text-6xl tracking-tight font-normal leading-tight">
          The cosmos is within us. We are made of star-stuff. We are a way for the universe to know itself.
        </h1>
      </div>

      {/* Render the client-only 3D Canvas */}
      <div className="w-full h-full z-0">
        <CosmosOrbitGalleryCanvas />
      </div>
    </section>
  );
}
