export type IssueStatus = 'Pending' | 'In Progress' | 'Resolved'

export type Issue = {
  id: string
  createdAt: string
  imageName: string
  location: string
  category: string
  severity: number
  department: string
  description: string
  status: IssueStatus
}

const triageRules = [
  { keyword: ['pothole', 'road', 'crack'], category: 'Deep Pothole', severity: 9, department: 'Roads & Transport' },
  { keyword: ['light', 'streetlight', 'dark'], category: 'Broken Streetlight', severity: 6, department: 'Electric Works' },
  { keyword: ['dump', 'garbage', 'trash'], category: 'Illegal Dumping', severity: 7, department: 'Sanitation' },
  { keyword: ['water', 'leak', 'flood'], category: 'Water Leakage', severity: 8, department: 'Water Utility' },
]

const issues: Issue[] = [
  {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    imageName: 'sample-pothole.jpg',
    location: 'MG Road, Bengaluru',
    description: 'Large pothole near bus stop causing bike accidents',
    category: 'Deep Pothole',
    severity: 9,
    department: 'Roads & Transport',
    status: 'Pending'
  }
]

export function simulateVisionTriage(input: { description: string; imageName: string }) {
  const text = `${input.description} ${input.imageName}`.toLowerCase()
  const match = triageRules.find((rule) => rule.keyword.some((word) => text.includes(word)))

  if (match) {
    return {
      category: match.category,
      severity: match.severity,
      department: match.department,
    }
  }

  return {
    category: 'General Civic Issue',
    severity: 5,
    department: 'Municipal Operations',
  }
}

export function getIssues() {
  return [...issues].sort((a, b) => b.severity - a.severity)
}

export function addIssue(payload: { imageName: string; location: string; description: string }) {
  const triage = simulateVisionTriage({ description: payload.description, imageName: payload.imageName })

  const issue: Issue = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    imageName: payload.imageName,
    location: payload.location,
    description: payload.description,
    category: triage.category,
    severity: triage.severity,
    department: triage.department,
    status: 'Pending',
  }

  issues.push(issue)
  return issue
}

export function updateIssueStatus(id: string, status: IssueStatus) {
  const issue = issues.find((item) => item.id === id)
  if (!issue) return null
  issue.status = status
  return issue
}
