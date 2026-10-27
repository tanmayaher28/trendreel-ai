import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type JamendoTrack = {
  id?: string;
  name?: string;
  artist_name?: string;
  album_name?: string;
  image?: string;
  audio?: string;
  shareurl?: string;
  duration?: number;
  license_ccurl?: string;
};

const genres = new Set(["Ambient","Electronic","Jazz","Rock","Classical","Instrumental"]);

export async function GET(request: Request) {
  const clientId = process.env.JAMENDO_CLIENT_ID;
  if (!clientId) return NextResponse.json({ configured: false, tracks: [] });

  const params = new URL(request.url).searchParams;
  const search = (params.get("q") || "").trim().slice(0, 100);
  const genre = params.get("genre") || "";
  const offset = Math.max(0, Math.min(10000, Number.parseInt(params.get("offset") || "0", 10) || 0));

  const upstream = new URL("https://api.jamendo.com/v3.0/tracks/");
  upstream.searchParams.set("client_id", clientId);
  upstream.searchParams.set("format", "json");
  upstream.searchParams.set("limit", "24");
  upstream.searchParams.set("offset", String(offset));
  upstream.searchParams.set("type", "single albumtrack");
  upstream.searchParams.set("include", "licenses");
  upstream.searchParams.set("imagesize", "500");
  upstream.searchParams.set("audioformat", "mp32");
  if (search) upstream.searchParams.set("search", search);
  if (genres.has(genre)) upstream.searchParams.set("tags", genre.toLowerCase());

  try {
    const response = await fetch(upstream, { cache: "no-store" });
    if (!response.ok) return NextResponse.json({ error: "Music provider returned an error." }, { status: 502 });
    const data = await response.json();
    if (data.headers?.status !== "success") return NextResponse.json({ error: "Music provider could not return tracks." }, { status: 502 });
    const tracks = (data.results as JamendoTrack[] || []).filter((item) => item.id && item.name && item.artist_name && item.audio && item.shareurl).map((item) => ({
      id: item.id!,
      name: item.name!,
      artist_name: item.artist_name!,
      album_name: item.album_name || "",
      image: item.image || "",
      audio: item.audio!,
      shareurl: item.shareurl!,
      duration: item.duration || 0,
      license_ccurl: item.license_ccurl || "",
    }));
    return NextResponse.json({ configured: true, tracks }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Could not contact the music provider." }, { status: 502 });
  }
}

