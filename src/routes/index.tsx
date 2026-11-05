import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Atmosphere } from "@/components/demon/Atmosphere";
import { Cursor } from "@/components/demon/Cursor";
import { Preloader } from "@/components/demon/Preloader";
import { Nav } from "@/components/demon/Nav";
import { Hero } from "@/components/demon/Hero";
import { FrameSequence } from "@/components/demon/FrameSequence";
import { Specs } from "@/components/demon/Specs";
import { Performance } from "@/components/demon/Performance";
import { Gallery } from "@/components/demon/Gallery";
import { Engineering } from "@/components/demon/Engineering";
import { Timeline } from "@/components/demon/Timeline";
import { Configurator } from "@/components/demon/Configurator";
import { About } from "@/components/demon/About";
import { Footer } from "@/components/demon/Footer";
import { useHydrated, useSmoothScroll } from "@/components/demon/hooks";

const TITLE = "SRT Demon — 808 HP Cinematic Challenger Experience";
const DESCRIPTION =
  "An immersive cinematic experience for the Dodge Challenger SRT Demon: 808 horsepower, 2.3s 0–60, live configurator, engine teardown and full performance telemetry.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const hydrated = useHydrated();
  const [ready, setReady] = useState(false);
  useSmoothScroll(ready);

  return (
    <div className="relative min-h-screen bg-jet">
      {hydrated && (
        <>
          <Cursor />
          <Atmosphere />
          <Preloader onDone={() => setReady(true)} />
        </>
      )}

      <Nav />

      <main className="relative z-10">
        <Hero />
        <FrameSequence />
        <Specs />
        <Performance />
        <Gallery />
        <Engineering />
        <Timeline />
        <Configurator />
        <About />
      </main>

      <Footer />
    </div>
  );
}
