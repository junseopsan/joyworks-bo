import { supabase } from '@/lib/supabase'
import { DashboardCard } from '@/components/admin/dashboard-card'
import { DashboardChart } from '@/components/admin/dashboard-chart'

export default async function AdminPage() {
  const { data: stats } = await supabase.rpc('get_dashboard_stats')
  const { data: activityData } = await supabase.rpc('get_activity_stats')

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="총 사용자"
          value={stats.total_users}
          description="전체 등록된 사용자 수"
        />
        <DashboardCard
          title="총 질문"
          value={stats.total_questions}
          description="전체 등록된 질문 수"
        />
        <DashboardCard
          title="총 답변"
          value={stats.total_answers}
          description="전체 등록된 답변 수"
        />
        <DashboardCard
          title="답변률"
          value={`${stats.answer_rate}%`}
          description="질문당 평균 답변 수"
        />
      </div>

      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <h3 className="font-semibold">활동 통계</h3>
          <DashboardChart data={activityData} />
        </div>
      </div>
    </div>
  )
} 