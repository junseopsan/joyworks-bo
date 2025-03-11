interface DashboardCardProps {
  title: string
  value: string | number
  description: string
}

export function DashboardCard({ title, value, description }: DashboardCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold">{value}</p>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{description}</p>
    </div>
  )
} 