import { NextResponse } from "next/server";
import {
  invokeHireFunction,
  resolveReturnOrigin,
} from "@/lib/hire-server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const data = await invokeHireFunction(
      "hire-update-fulfilment",
      body,
      resolveReturnOrigin(request),
    );
    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not update fulfilment";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
