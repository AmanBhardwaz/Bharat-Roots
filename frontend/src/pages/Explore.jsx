import { Link } from "react-router-dom";
import {
  MapPin,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { heritageSites } from "../data/heritageData";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import L from "leaflet";


// Fix Leaflet marker icons in Vite

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});


export default function Explore() {

  return (
    <div className="min-h-screen bg-slate-50">

      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pb-20 pt-32">

        {/* HEADER */}

        <div className="mb-10">

          <p className="font-semibold text-orange-600">
            EXPLORE INDIA
          </p>

          <h1 className="mt-2 text-4xl font-black text-slate-900">
            Discover India's Heritage
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Explore monuments and cultural treasures across India.
          </p>

        </div>


        {/* MAP */}

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

          <MapContainer
            center={[22.9734, 78.6569]}
            zoom={5}
            scrollWheelZoom={true}
            className="h-[550px] w-full"
          >

            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />


            {heritageSites.map((site) => (

              <Marker
                key={site.id}
                position={[
                  site.latitude,
                  site.longitude,
                ]}
              >

                <Popup>

                  <div className="w-56">

                    <img
                      src={site.image}
                      alt={site.name}
                      className="mb-3 h-28 w-full rounded-lg object-cover"
                    />

                    <h3 className="font-bold text-slate-900">
                      {site.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {site.city}, {site.state}
                    </p>

                    <Link
                      to={`/heritage/${site.id}`}
                      className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-orange-600"
                    >
                      Explore
                      <ArrowRight size={14} />
                    </Link>

                  </div>

                </Popup>

              </Marker>

            ))}

          </MapContainer>

        </div>


        {/* HERITAGE CARDS */}

        <div className="mt-14">

          <div className="mb-7">

            <h2 className="text-2xl font-bold text-slate-900">
              Featured Heritage
            </h2>

            <p className="mt-2 text-slate-500">
              Explore some of India's cultural landmarks.
            </p>

          </div>


          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-4">

            {heritageSites.map((site) => (

              <Link
                key={site.id}
                to={`/heritage/${site.id}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >

                <div className="relative h-52 overflow-hidden">

                  <img
                    src={site.image}
                    alt={site.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  {site.verified && (
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-emerald-700 shadow">

                      <ShieldCheck size={13} />

                      Verified

                    </div>
                  )}

                </div>


                <div className="p-5">

                  <p className="flex items-center gap-1 text-sm text-orange-600">

                    <MapPin size={14} />

                    {site.city}, {site.state}

                  </p>


                  <h3 className="mt-2 text-xl font-bold text-slate-900">
                    {site.name}
                  </h3>


                  <p className="mt-2 text-sm text-slate-500">
                    {site.category}
                  </p>


                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-slate-700">

                    Explore

                    <ArrowRight size={16} />

                  </div>

                </div>

              </Link>

            ))}

          </div>

        </div>

      </main>

    </div>
  );
}