'use client'
export default function StatCard({ icon, label, value }){
  return (
    <div className="card">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-black/20 flex items-center justify-center text-accent text-xl">{icon}</div>
        <div>
          <div className="small-muted">{label}</div>
          <div className="text-xl font-semibold mt-1">{value}</div>
        </div>
      </div>
    </div>
  )
}
