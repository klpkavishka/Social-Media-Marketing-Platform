import { NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'

export async function GET() {
  try {
    const token = await auth0.getAccessToken()
    
    // Auth0 getAccessToken returns a string token by default in v4,
    // but we support both accessToken and token fields for safety.
    return NextResponse.json({ 
      accessToken: token,
      token: token
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to retrieve token in custom API route handler:', error)
    }
    return NextResponse.json(
      { error: 'Failed to retrieve token' },
      { status: 401 }
    )
  }
}
