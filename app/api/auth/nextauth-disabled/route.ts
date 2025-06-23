// NextAuth temporarily disabled for build fix
export async function GET() {
  return new Response('NextAuth endpoint disabled', { status: 503 })
}

export async function POST() {
  return new Response('NextAuth endpoint disabled', { status: 503 })
}
