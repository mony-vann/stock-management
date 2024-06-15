import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { lat, lng } = await req.json();
    const shopLat = 11.479566;
    const shopLng = 104.946117;
    const allowedDistance = 15;

    const distance = getDistanceFromLatLonInKm(lat, lng, shopLat, shopLng);

    if (distance <= allowedDistance) {
      return NextResponse.json({ allowed: true });
    } else {
      return NextResponse.json({ allowed: false });
    }
  } catch (error) {
    console.error("Error checking in:", error);
  }
}

function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}
