import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function POST(request: NextRequest) {
  try {
    console.log('✨ [API Route] Received caption enhancement request');
    console.log(`🔗 [API Route] Backend URL: ${BACKEND_URL}`);

    const response = await fetch(`${BACKEND_URL}/api/hashtags/generate-caption`, {
      method: 'POST',
      headers: {
        'content-type': request.headers.get('content-type') || '',
      },
      body: request.body as unknown as BodyInit,
      // @ts-expect-error - duplex is required for streaming request body in Node.js fetch
      duplex: 'half',
    });

    console.log(`📊 [API Route] Backend responded with status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [API Route] Backend error (${response.status}):`, errorText);
      return NextResponse.json(
        { error: `Backend error: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ [API Route] Caption enhancement successful');
    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ [API Route] Error:', errorMessage);

    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
