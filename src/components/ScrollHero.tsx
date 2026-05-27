import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, MotionValue } from "framer-motion";

type Slide = {
  headline: string;
  subhead: string;
  cardTitle: string;
  cardBody: string;
};

const SLIDES: Slide[] = [
  {
    headline: "Curated marketplace",
    subhead: "Hand-picked dental excellence",
    cardTitle: "Every clinic and lab vetted",
    cardBody:
      "We only invite the top 1% of dental professionals worldwide — no open sign-ups, no noise.",
  },
  {
    headline: "Verified specialists",
    subhead: "Credentials you can trust",
    cardTitle: "Real specialty, real cases",
    cardBody:
      "Implantology, orthodontics, prosthodontics and more — every specialty verified at the source.",
  },
  {
    headline: "Precision delivery",
    subhead: "From scan to final restoration",
    cardTitle: "End-to-end digital workflow",
    cardBody:
      "Intraoral scans, design and milling orchestrated in one seamless flow across the network.",
  },
  {
    headline: "Built for the modern clinic",
    subhead: "Software that respects your time",
    cardTitle: "Less admin. More dentistry.",
    cardBody:
      "NOMA handles referrals, payments and case tracking so you can focus on patients.",
  },
];

const SlideOpacity = ({
  progress,
  index,
  total,
  children,
}: {
  progress: MotionValue<number>;
  index: number;
  total: number;
  children: (opacity: MotionValue<number>) => React.ReactNode;
}) => {
  const span = 1 / total;
  const start = index * span;
  const end = start + span;
  const fade = span * 0.25;

  const opacity = useTransform(
    progress,
    [
      Math.max(0, start - fade),
      start + fade * 0.5,
      end - fade * 0.5,
      Math.min(1, end + fade),
    ],
    index === 0
      ? [1, 1, 1, 0]
      : index === total - 1
      ? [0, 1, 1, 1]
      : [0, 1, 1, 0]
  );

  return <>{children(opacity)}</>;
};

const ScrollHero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(SLIDES.length - 1, Math.floor(v * SLIDES.length));
    setActive(idx);
  });

  return (
    <section
      ref={ref}
      aria-label="NOMA Curated Marketplace"
      className="relative w-full bg-background"
      style={{ height: `${SLIDES.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="mx-auto flex h-full max-w-7xl items-center px-6 md:px-10 lg:px-16">
          <div className="grid h-full w-full grid-cols-1 items-center gap-10 py-20 md:grid-cols-2 md:gap-16">
            {/* Left column — headline stack */}
            <div className="relative min-h-[280px] md:min-h-[460px]">
              {SLIDES.map((s, i) => (
                <SlideOpacity
                  key={`l-${i}`}
                  progress={scrollYProgress}
                  index={i}
                  total={SLIDES.length}
                >
                  {(opacity) => (
                    <motion.div
                      style={{ opacity }}
                      className="absolute inset-0 flex flex-col justify-center"
                    >
                      <h2 className="text-5xl font-black leading-[0.95] tracking-tight text-foreground md:text-7xl lg:text-8xl">
                        {s.headline}
                      </h2>
                      <p className="mt-6 max-w-md text-base font-light text-foreground/60 md:text-lg">
                        {s.subhead}
                      </p>
                    </motion.div>
                  )}
                </SlideOpacity>
              ))}
            </div>

            {/* Right column — card stack */}
            <div className="relative min-h-[280px] md:min-h-[460px]">
              {SLIDES.map((s, i) => (
                <SlideOpacity
                  key={`r-${i}`}
                  progress={scrollYProgress}
                  index={i}
                  total={SLIDES.length}
                >
                  {(opacity) => (
                    <motion.div
                      style={{ opacity }}
                      className="absolute inset-0 flex items-center"
                    >
                      <div className="w-full rounded-3xl bg-muted p-8 md:p-12 lg:p-14">
                        <h3 className="text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
                          {s.cardTitle}
                        </h3>
                        <p className="mt-6 text-base font-light leading-relaxed text-foreground/60 md:text-lg">
                          {s.cardBody}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </SlideOpacity>
              ))}
            </div>
          </div>
        </div>

        {/* Progress dots */}
        <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-3 md:flex">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                active === i ? "bg-foreground scale-125" : "bg-foreground/25"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScrollHero;
