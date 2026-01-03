import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Terminal, ShieldCheck } from "lucide-react";
import Header from "../ui/Header";
import MagneticButton from "../ui/MagneticButton";
import ParallaxImage from "../ui/ParallaxImage";
import AnimatedElement from "../ui/AnimatedElement";
import { motion } from "framer-motion";
import { features } from "../../staticData/features";
import { workflowSteps } from "../../staticData/workflowSteps";
import { useAuth } from "../../context/authContext";

export default function HomePage() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen bg-background text-textprimary font-paragraph selection:bg-primary selection:text-white overflow-x-clip">
      <Header />

      {/* --- HERO SECTION --- */}
      <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden pt-20 border-b border-textprimary/10">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-background opacity-90" />
          <svg
            className="w-full h-full absolute inset-0"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <pattern
                id="hero-grid"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-textprimary/20"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>

          <motion.div
            className="absolute top-1/4 left-1/4 w-32 h-16 bg-primary/80 backdrop-blur-sm"
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/4 w-24 h-24 border-2 border-primary"
            animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute top-1/3 right-1/3 w-16 h-16 bg-textprimary/10"
            animate={{ x: [0, 40, 0], opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>

        <div className="relative z-10 max-w-[120rem] mx-auto px-6 lg:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8">
              <AnimatedElement>
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/30 bg-primary/5 text-primary text-xs font-mono mb-8">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  SYSTEM_ONLINE // V.2.0.4
                </div>
              </AnimatedElement>

              <AnimatedElement delay={100}>
                <h1 className="font-heading text-6xl lg:text-8xl font-bold text-textprimary leading-[0.9] tracking-tight mb-8">
                  INTELLIGENT <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">
                    RFP MATCHING
                  </span>{" "}
                  <br />
                  PROTOCOL
                </h1>
              </AnimatedElement>

              <AnimatedElement delay={200}>
                <p className="font-paragraph text-lg text-textprimary/70 max-w-2xl mb-10 leading-relaxed border-l-2 border-primary pl-6">
                  Revolutionizing vendor-buyer connections with AI-powered
                  requirement parsing and automated vendor shortlisting. The
                  future of procurement is algorithmic.
                </p>
              </AnimatedElement>

              {!isLoggedIn && (
                <AnimatedElement delay={300}>
                  <div className="flex flex-wrap gap-6">
                    <Link to="/vendor-register">
                      <MagneticButton className="group relative px-8 py-4 bg-textprimary text-background font-mono text-sm overflow-hidden">
                        <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                        <span className="relative flex items-center gap-2 group-hover:text-white transition-colors">
                          {"{ REGISTER_VENDOR }"}{" "}
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </MagneticButton>
                    </Link>
                    <Link to="/buyer-register">
                      <MagneticButton className="group px-8 py-4 border border-textprimary text-textprimary font-mono text-sm hover:bg-textprimary/5 transition-colors">
                        <span className="flex items-center gap-2">
                          {"{ REGISTER_BUYER }"}
                        </span>
                      </MagneticButton>
                    </Link>
                  </div>
                </AnimatedElement>
              )}
            </div>

            {/* Hero Visual - Abstract Representation of Matching */}
            <div className="lg:col-span-4 relative h-[400px] lg:h-[600px] hidden lg:block">
              <div className="absolute inset-0 border border-textprimary/10 bg-background/50 backdrop-blur-sm p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <Terminal className="w-8 h-8 text-primary" />
                  <div className="text-xs font-mono text-textprimary/40">
                    STATUS: ACTIVE
                    <br />
                    NODES: 4,291
                  </div>
                </div>

                <div className="space-y-4 font-mono text-xs text-textprimary/60">
                  <div className="flex justify-between border-b border-dashed border-textprimary/20 pb-2">
                    <span>{">"} Parsing Requirements...</span>
                    <span className="text-primary">DONE</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-textprimary/20 pb-2">
                    <span>{">"} Analyzing Vendor DB...</span>
                    <span className="text-primary">DONE</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-textprimary/20 pb-2">
                    <span>{">"} Calculating Match Score...</span>
                    <span className="text-primary">98.4%</span>
                  </div>
                  <div className="p-4 bg-primary/5 border border-primary/20 mt-4">
                    <span className="text-primary block mb-2">
                      {">"} MATCH_FOUND:
                    </span>
                    <div className="h-2 bg-primary/20 rounded w-3/4 mb-2 animate-pulse" />
                    <div className="h-2 bg-primary/20 rounded w-1/2 animate-pulse" />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[...Array(16)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="aspect-square border border-textprimary/10"
                      animate={{
                        backgroundColor:
                          Math.random() > 0.8
                            ? "rgba(216, 64, 14, 0.2)"
                            : "transparent",
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MARQUEE SECTION --- */}
      <section className="py-8 border-b border-textprimary/10 bg-secondary text-secondary-foreground overflow-hidden">
        <div className="flex whitespace-nowrap">
          <motion.div
            className="flex gap-16 items-center"
            animate={{ x: "-50%" }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-16 items-center">
                {[
                  "AI_POWERED",
                  "REAL_TIME_MATCHING",
                  "SECURE_PROCUREMENT",
                  "VENDOR_VERIFICATION",
                  "GLOBAL_NETWORK",
                  "AUTOMATED_RFP",
                ].map((text, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="text-2xl font-heading font-bold tracking-wider opacity-80">
                      {text}
                    </span>
                    <div className="w-2 h-2 bg-primary rotate-45" />
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- FEATURES GRID SECTION --- */}
      <section className="py-32 bg-background relative">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20">
            <AnimatedElement>
              <h2 className="font-heading text-4xl lg:text-6xl font-bold max-w-2xl">
                SYSTEM <span className="text-primary">CAPABILITIES</span>
              </h2>
            </AnimatedElement>
            <AnimatedElement delay={200}>
              <p className="font-paragraph text-sm text-textprimary/60 max-w-md mt-6 md:mt-0">
                <b> ARCHITECTURE </b>
                <br />
                Comprehensive toolset designed for high-velocity procurement and
                precise vendor discovery.
              </p>
            </AnimatedElement>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-textprimary/10 border border-textprimary/10">
            {features.map((feature, index) => (
              <AnimatedElement
                key={feature.id}
                delay={index * 100}
                className="h-full"
              >
                <div className="group relative h-full bg-background p-10 hover:bg-secondary hover:text-secondary-foreground transition-all duration-500 overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <ArrowRight className="w-6 h-6 -rotate-45 text-primary" />
                  </div>

                  <div className="mb-8 relative">
                    <div className="w-12 h-12 bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                      <feature.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-500" />
                    </div>
                    <div className="absolute -bottom-4 left-0 w-8 h-px bg-textprimary/20 group-hover:w-full group-hover:bg-primary/50 transition-all duration-700" />
                  </div>

                  <h3 className="font-heading text-xl font-bold mb-4 group-hover:translate-x-2 transition-transform duration-500">
                    {feature.title}
                  </h3>
                  <p className="font-paragraph text-sm text-textprimary/60 group-hover:text-secondary-foreground/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </section>

      {/* --- STICKY WORKFLOW SECTION --- */}
      <section className="relative bg-secondary text-secondary-foreground py-32">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <AnimatedElement className="mb-24 text-center">
            <h2 className="font-heading text-4xl lg:text-6xl font-bold">
              EXECUTION <span className="text-primary">PROTOCOL</span>
            </h2>
          </AnimatedElement>

          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-secondary-foreground/20  md:block border" />

            {workflowSteps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col md:flex-row gap-12 md:gap-24 items-center mb-32 last:mb-0 ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="flex-1 w-full">
                  <AnimatedElement
                    className={`bg-secondary-foreground/5 p-8 md:p-12 border border-secondary-foreground/10 hover:border-primary/50 transition-colors duration-500 ${
                      index % 2 === 1 ? "md:text-right" : ""
                    }`}
                  >
                    <div
                      className={`font-mono text-primary text-sm mb-4 flex items-center gap-2 ${
                        index % 2 === 1 ? "md:justify-end" : ""
                      }`}
                    >
                      <span className="w-2 h-2 bg-primary rounded-full" />
                      STEP_{step.step}
                    </div>
                    <h3 className="font-heading text-3xl font-bold mb-6">
                      {step.title}
                    </h3>
                    <p className="font-paragraph text-secondary-foreground/70 mb-6 text-lg">
                      {step.description}
                    </p>
                    <div
                      className={`flex items-start gap-3 text-sm text-secondary-foreground/50 font-mono ${
                        index % 2 === 1
                          ? "md:flex-row-reverse md:text-right"
                          : ""
                      }`}
                    >
                      <Terminal className="w-4 h-4 mt-1 shrink-0" />
                      {step.details}
                    </div>
                  </AnimatedElement>
                </div>
                <div className="relative hidden md:flex items-center justify-center w-8 h-8 shrink-0">
                  <div className="w-4 h-4 bg-secondary border-2 border-primary rounded-full z-10" />
                </div>

                <div className="flex-1 w-full">
                  <AnimatedElement delay={200}>
                    <div className="relative aspect-[4/3] overflow-hidden border border-secondary-foreground/10 group">
                      <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                      />

                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary z-20" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary z-20" />
                    </div>
                  </AnimatedElement>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- VISUAL BREATHER / PARALLAX SECTION --- */}
      <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <ParallaxImage
            src="https://static.wixstatic.com/media/0dda38_0343c8bb6c8c4eeebce715ba2827007e~mv2.png?originWidth=1280&originHeight=704"
            alt="Global Network"
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-black/60 z-10" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-10 mix-blend-overlay" />
        </div>

        <div className="relative z-20 text-center max-w-4xl px-6">
          <AnimatedElement>
            <h2 className="font-heading text-5xl lg:text-7xl font-bold text-white mb-8 tracking-tight">
              GLOBAL{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                CONNECTIVITY
              </span>
            </h2>
          </AnimatedElement>
          <AnimatedElement delay={200}>
            <p className="font-paragraph text-xl text-white/80 leading-relaxed">
              Join a network of over 10,000+ verified vendors and buyers. Our
              infrastructure handles millions of data points to ensure the
              perfect match.
            </p>
          </AnimatedElement>
          <AnimatedElement delay={400}>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-white">
              {[
                { label: "Active Vendors", value: "5k+" },
                { label: "RFPs Processed", value: "12k+" },
                { label: "Match Rate", value: "98%" },
                { label: "Time Saved", value: "40%" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="border-l border-primary/50 pl-6 text-left"
                >
                  <div className="font-heading text-3xl font-bold mb-1">
                    {stat.value}
                  </div>
                  <div className="font-mono text-xs text-white/60 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedElement>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/4" />

        <div className="max-w-[120rem] mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <AnimatedElement>
                <h2 className="font-heading text-5xl lg:text-7xl font-bold mb-8 leading-none">
                  INITIALIZE <br />
                  <span className="text-primary">YOUR GROWTH</span>
                </h2>
              </AnimatedElement>
              <AnimatedElement delay={200}>
                <p className="font-paragraph text-lg text-textprimary/70 mb-10 max-w-xl">
                  Stop searching manually. Let our AI infrastructure handle the
                  complexity of procurement matching while you focus on closing
                  deals.
                </p>
              </AnimatedElement>
              <AnimatedElement delay={300}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/rfp-submit" className="w-full sm:w-auto"></Link>
                </div>
              </AnimatedElement>
            </div>

            <div className="relative hidden lg:block">
              <AnimatedElement delay={400}>
                <div className="relative w-full aspect-square max-w-md mx-auto">
                  <div className="absolute inset-0 border-2 border-textprimary/10 rotate-3" />
                  <div className="absolute inset-0 border-2 border-textprimary/10 -rotate-3" />
                  <div className="absolute inset-4 bg-secondary p-8 flex flex-col justify-center items-center text-center border border-primary/20 shadow-2xl shadow-primary/10">
                    <ShieldCheck className="w-16 h-16 text-primary mb-6" />
                    <h3 className="font-heading text-2xl text-white mb-2">
                      Enterprise Grade
                    </h3>
                    <p className="font-paragraph text-sm text-white/60">
                      SOC2 Compliant
                      <br />
                      End-to-End Encryption
                      <br />
                      Verified Entities Only
                    </p>
                    <div className="mt-8 w-full h-1 bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </AnimatedElement>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
}
