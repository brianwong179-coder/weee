import projectsData from '@/content/projects.json'

export type Category = 'Drone' | 'Rocket' | 'Flight Control'

export const categories: Category[] = ['Drone', 'Rocket', 'Flight Control']

export type Status = 'Flying' | 'In Development' | 'Retired' | 'Bench Testing'

export const statuses: Status[] = [
  'Flying',
  'In Development',
  'Retired',
  'Bench Testing',
]

export const categoryStyles: Record<Category, string> = {
  Drone: 'bg-sky/15 text-sky border border-sky/30',
  Rocket: 'bg-accent/15 text-accent border border-accent/30',
  'Flight Control': 'bg-foreground/10 text-foreground border border-border',
}

export type Spec = { label: string; value: string }

export type Section = { heading: string; body: string[] }

export type Project = {
  slug: string
  title: string
  category: Category
  tagline: string
  summary: string
  status: Status
  year: string
  cover: string
  stack: string[]
  specs: Spec[]
  sections: Section[]
}

// Project content is stored in content/projects.json so it can be edited by the
// project tool (CLI + /admin) without touching source. The shape is validated
// against the Project type here.
export const projects: Project[] = projectsData as Project[]

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug)
}
