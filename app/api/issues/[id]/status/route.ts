import { NextRequest, NextResponse } from 'next/server'
import { updateIssueStatus } from '@/lib/issuesStore'

const allowedStatuses = ['Pending', 'In Progress', 'Resolved'] as const

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()

  if (!allowedStatuses.includes(body.status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const issue = updateIssueStatus(params.id, body.status)
  if (!issue) {
    return NextResponse.json({ error: 'Issue not found' }, { status: 404 })
  }

  return NextResponse.json({ issue })
}
