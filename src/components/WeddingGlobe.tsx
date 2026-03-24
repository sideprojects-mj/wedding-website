import { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";

const NAPA_VALLEY = { lat: 38.5, lng: -122.3, label: "The Grand Estate, Napa Valley" };

const WeddingGlobe = () => {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 700, height: 550 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const w = Math.min(containerRef.current.offsetWidth, 900);
        setDimensions({ width: w, height: Math.min(w * 0.8, 600) });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      const globe = globeRef.current;
      // Start viewing North America from a high angle
      globe.pointOfView({ lat: 30, lng: -100, altitude: 1.8 }, 0);
      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.3;
      globe.controls().enableZoom = false;
      globe.controls().enablePan = false;
      globe.controls().minPolarAngle = Math.PI * 0.3;
      globe.controls().maxPolarAngle = Math.PI * 0.7;
    }
  }, []);

  const markerData = [NAPA_VALLEY];

  const ringsData = [
    {
      lat: NAPA_VALLEY.lat,
      lng: NAPA_VALLEY.lng,
      maxR: 4,
      propagationSpeed: 1.5,
      repeatPeriod: 1400,
    },
  ];

  const htmlData = [
    {
      lat: NAPA_VALLEY.lat,
      lng: NAPA_VALLEY.lng,
      label: "The Grand Estate\nNapa Valley, CA",
    },
  ];

  return (
    <div
      ref={containerRef}
      className="w-full flex flex-col items-center relative"
      style={{ background: "radial-gradient(ellipse at center, #0d1117 0%, #010409 100%)" }}
    >
      {/* Subtle glow behind globe */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(232,170,185,0.06) 0%, transparent 60%)",
        }}
      />
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="rgba(0,0,0,0)"
        // Dot markers
        pointsData={markerData}
        pointLat="lat"
        pointLng="lng"
        pointColor={() => "#ffffff"}
        pointAltitude={0.02}
        pointRadius={0.35}
        // Pulsing rings
        ringsData={ringsData}
        ringColor={() => (t: number) => `rgba(255,255,255,${0.6 * (1 - t)})`}
        ringMaxRadius="maxR"
        ringPropagationSpeed="propagationSpeed"
        ringRepeatPeriod="repeatPeriod"
        // Labels
        labelsData={htmlData}
        labelLat="lat"
        labelLng="lng"
        labelText="label"
        labelSize={1.4}
        labelDotRadius={0.3}
        labelColor={() => "rgba(255,255,255,0.9)"}
        labelAltitude={0.03}
        labelResolution={3}
        // Atmosphere
        atmosphereColor="#4a90d9"
        atmosphereAltitude={0.15}
        animateIn={true}
      />
      {/* Location badge */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-5 py-2 text-white/80 text-xs tracking-[0.15em] uppercase">
        Napa Valley, California
      </div>
    </div>
  );
};

export default WeddingGlobe;
