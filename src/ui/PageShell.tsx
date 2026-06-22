import type { ReactNode } from 'react'

type PageShellProps = {
  title: string
  description: string
  children?: ReactNode
}

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <section className="space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{title}</h2>
        <p className="mt-3 max-w-3xl text-slate-600">{description}</p>
      </div>
      {children}
    </section>
  )
}
