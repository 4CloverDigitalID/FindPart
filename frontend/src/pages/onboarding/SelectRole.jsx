import { Link } from 'react-router-dom'

export default function SelectRole() {
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto mt-20 max-w-3xl rounded-3xl bg-white p-10 shadow-xl">
        <h1 className="text-4xl font-black text-slate-900">Pilih Role</h1>
        <p className="mt-3 text-slate-600">Sebelum memulai, tentukan kamu ingin masuk sebagai startup atau talent.</p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Link
            to="/register?role=startup"
            className="rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-500">Role</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Startup</h2>
            <p className="mt-2 text-sm text-slate-600">Cari co-founder atau talent untuk menumbuhkan produk.</p>
          </Link>

          <Link
            to="/register?role=talent"
            className="rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-500">Role</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Talent</h2>
            <p className="mt-2 text-sm text-slate-600">Temukan startup yang sesuai dengan skill dan tujuan kariermu.</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
