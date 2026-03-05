import { NextRequest, NextResponse } from 'next/server'
import { addIssue, getIssues } from '@/lib/issuesStore'

export async function GET() {
  return NextResponse.json({ issues: getIssues() })
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  if (!body.imageName || !body.location || !body.description) {
    return NextResponse.json({ error: 'imageName, location and description are required' }, { status: 400 })
  }

  const issue = addIssue(body)
  return NextResponse.json({ issue }, { status: 201 })
}
