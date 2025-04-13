import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";

export async function POST(req: NextRequest) {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto("https://pk.indeed.com/", { waitUntil: "domcontentloaded" });

    const content = await page.content();
    console.log("Page HTML:\n", content);

    await browser.close();

    return NextResponse.json({ success: true, message: "Page loaded and logged" }, { status: 200 });
  } catch (err: any) {
    console.error("Error loading page:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
