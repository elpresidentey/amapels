import { NextResponse } from "next/server"

/**
 * IndexNow key file.
 *
 * Search engines (Bing, Yandex, Seznam, Naver) fetch this file to confirm we
 * are allowed to submit URLs for that host. The body must be exactly the key,
 * and the path must be /<key>.txt.
 */
export const dynamic = "force-static"

const KEY = "ba6249c4693724029b00a12b0037a8f3"

export function GET() {
  return new NextResponse(KEY, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=86400",
    },
  })
}
