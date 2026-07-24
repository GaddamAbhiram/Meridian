// Genuinely public: the false-positive trap. No login required, no owner
// field in the response - a normal product listing. BoLD should watch this
// route and correctly never flag it.

import { NextResponse } from "next/server";
import { withBold } from "@boldsec/next";
import { store } from "@/lib/store";
import { ensureSeeded } from "@/lib/seed";

async function handleGet() {
  ensureSeeded();
  return NextResponse.json({ products: store.products });
}

export const GET = withBold(handleGet, {});
