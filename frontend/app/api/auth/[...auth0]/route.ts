import { auth0 } from '@/lib/auth0'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  try {
    return await auth0.middleware(request)
  } catch (error: any) {
    console.error('Auth0 Middleware Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

export const POST = async (request: NextRequest) => {
  try {
    return await auth0.middleware(request)
  } catch (error: any) {
    console.error('Auth0 Middleware Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
