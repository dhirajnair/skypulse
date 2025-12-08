import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface SkyMapVizProps {
  ra: number;
  dec: number;
}

const SkyMapViz: React.FC<SkyMapVizProps> = ({ ra, dec }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 300;
    const height = 150;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Aitoff projection for sky map
    const projection = d3.geoAitoff()
      .scale(70)
      .translate([width / 2, height / 2])
      .precision(0.1);

    const path = d3.geoPath().projection(projection);
    const graticule = d3.geoGraticule();

    // Draw background
    svg.append("path")
      .datum({type: "Sphere"})
      .attr("d", path as any)
      .attr("fill", "#1E293B")
      .attr("stroke", "#475569");

    // Draw grid lines
    svg.append("path")
      .datum(graticule)
      .attr("d", path as any)
      .attr("fill", "none")
      .attr("stroke", "#334155")
      .attr("stroke-width", 0.5);

    // Convert RA/Dec to GeoJSON point
    // RA (0-360) maps to Longitude (-180 to 180 in D3)
    // Dec (-90 to 90) maps to Latitude
    const lon = ra > 180 ? ra - 360 : ra;
    const lat = dec;

    // Draw the object
    const point = { type: "Point", coordinates: [-lon, lat] }; // Invert RA for sky view usually

    svg.append("path")
      .datum(point as any)
      .attr("d", path as any)
      .attr("fill", "#F59E0B")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("class", "animate-pulse");

    // Add labels
    svg.append("text")
      .attr("x", 10)
      .attr("y", height - 10)
      .text(`RA: ${ra.toFixed(2)}°`)
      .attr("fill", "#94A3B8")
      .attr("font-size", "10px")
      .attr("font-family", "monospace");

    svg.append("text")
      .attr("x", width - 80)
      .attr("y", height - 10)
      .text(`Dec: ${dec.toFixed(2)}°`)
      .attr("fill", "#94A3B8")
      .attr("font-size", "10px")
      .attr("font-family", "monospace");

  }, [ra, dec]);

  return (
    <div className="w-full flex justify-center bg-space-950 rounded-lg border border-space-800 p-2">
      <svg ref={svgRef} width="300" height="150" viewBox="0 0 300 150" style={{ maxWidth: '100%' }} />
    </div>
  );
};

export default SkyMapViz;