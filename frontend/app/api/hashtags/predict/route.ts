import { NextRequest, NextResponse } from 'next/server';

// Use server-side env var (not NEXT_PUBLIC_ which is only inlined at build time)
const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function POST(request: NextRequest) {
  try {
    console.log('📝 [API Route] Received hashtag prediction request');
    console.log(`🔗 [API Route] Backend URL: ${BACKEND_URL}`);

    // Forward the request to the NestJS backend
    console.log(`🚀 [API Route] Forwarding to ${BACKEND_URL}/api/hashtags/predict`);
    
    const response = await fetch(`${BACKEND_URL}/api/hashtags/predict`, {
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
    console.log('✅ [API Route] Successfully parsed backend response');
    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ [API Route] Error:', errorMessage);
    console.error('❌ [API Route] Full error:', error);
    
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
