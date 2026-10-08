"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Branch } from "@/lib/types";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export function BranchMapInner({ branches }: { branches: Branch[] }) {
  const center: [number, number] =
    branches.length === 2
      ? [
          (branches[0].lat + branches[1].lat) / 2,
          (branches[0].lng + branches[1].lng) / 2,
        ]
      : [51.5, -0.5];

  return (
    <MapContainer
      center={center}
      zoom={7}
      scrollWheelZoom={false}
      className="h-full w-full"
      attributionControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {branches.map((branch) => (
        <Marker key={branch.id} position={[branch.lat, branch.lng]} icon={icon}>
          <Popup>
            <strong>{branch.name}</strong>
            <br />
            {branch.addressLocality}, {branch.postalCode}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
