// NextAuth route is temporarily disabled
// This file contains placeholder endpoints until authentication is properly configured

import { NextRequest, NextResponse } from 'next/server'

// Placeholder GET handler
export async function GET(req: NextRequest) {
  return NextResponse.json({ 
    message: 'NextAuth is temporarily disabled',
    status: 'placeholder' 
  })
}

// Placeholder POST handler
export async function POST(req: NextRequest) {
  return NextResponse.json({ 
    message: 'NextAuth is temporarily disabled',
    status: 'placeholder' 
  })
}