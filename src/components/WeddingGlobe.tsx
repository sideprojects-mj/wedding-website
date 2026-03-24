import { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";

const NAPA_VALLEY = { lat: 38.5, lng: -122.3, label: "The Grand Estate, Napa Valley" };

const WeddingGlobe = () => {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 500 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const w = Math.min(containerRef.current.offsetWidth, 800);
        setDimensions({ width: w, height: Math.min(w * 0.85, 500) });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      const globe = globeRef.current;
      globe.pointOfView({ lat: 35, lng: -100, altitude: 2.2 }, 0);
      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.4;
      globe.controls().enableZoom = false;
    }
  }, []);

  const markerData = [NAPA_VALLEY];
  const ringData = [{ lat: NAPA_VALLEY.lat, lng: NAPA_VALLEY.lng, maxR: 3, propagationSpeed: 2, repeatPeriod: 1200 }];

  return (
    <div ref={containerRef} className="w-full flex justify-center">
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        pointsData={markerData}
        pointLat="lat"
        pointLng="lng"
        pointColor={() => "hsl(346, 60%, 75%)"}
        pointAltitude={0.06}
        pointRadius={0.5}
        ringsData={ringData}
        ringColor={() => (t: number) => `rgba(232,170,185,${1 - t})`}
        ringMaxRadius="maxR"
        ringPropagationSpeed="propagationSpeed"
        ringRepeatPeriod="repeatPeriod"
        labelsData={markerData}
        labelLat="lat"
        labelLng="lng"
        labelText="label"
        labelSize={1.2}
        labelDotRadius={0.4}
        labelColor={() => "hsl(346, 60%, 85%)"}
        labelAltitude={0.07}
        atmosphereColor="hsl(346, 40%, 70%)"
        atmosphereAltitude={0.2}
      />
    </div>
  );
};

export default WeddingGlobe;
