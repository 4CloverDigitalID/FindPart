import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { IoClose } from "react-icons/io5"

import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

export default function Register() {
  const [searchParams] = useSearchParams()
  const roleFromQuery = searchParams.get('role')

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: roleFromQuery === 'talent' ? 'talent' : 'startup',
  })

  const { registerMutation } = useAuth()
  const navigate = useNavigate()

  const nextPath = useMemo(() => {
    return form.role === 'startup' ? '/onboarding/startup' : '/onboarding/talent'
  }, [form.role])

  useEffect(() => {
    if (registerMutation.data?.user) {
      navigate(nextPath, { replace: true })
    }
  }, [navigate, nextPath, registerMutation.data])

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await registerMutation.mutateAsync(form)
    } catch (error) {}
  }

  return (
    <div className="h-screen flex">
      
      {/* LEFT SIDE */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-10 lg:px-20">
        
        {/* Logo */}
        <div className="mb-8 flex items-center gap-2">
          <img src="image/icon-login.png" alt="Logo" />
        </div>

        <h1 style={{ fontFamily: 'inter' }} className="text-4xl font-semibold text-slate-900">
          Create an Account
        </h1>
        <p style={{ fontFamily: "inter" }} className="mt-2 text-slate-600">
          Create your first account to match with others
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">

          {/* NAME */}
          <div style={{ fontFamily: "inter" }}>
            <label className="text-sm text-slate-600">Full Name</label>
            <input
              type="text"
              placeholder="Your full name..."
              className="mt-1 w-full rounded-full border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* EMAIL */}
          <div style={{ fontFamily: "inter" }}>
            <label className="text-sm text-slate-600">Email</label>
            <input
              type="email"
              placeholder="Your Email..."
              className="mt-1 w-full rounded-full border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* PASSWORD */}
          <div style={{ fontFamily: "inter" }}>
            <label className="text-sm text-slate-600">Password</label>
            <input
              type="password"
              placeholder="8 Character"
              className="mt-1 w-full rounded-full border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div style={{ fontFamily: "inter" }}>
            <label className="text-sm text-slate-600">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              className="mt-1 w-full rounded-full border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={form.password_confirmation}
              onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
            />
          </div>

          {/* ROLE */}
          <div style={{ fontFamily: "inter" }}>
            <label className="text-sm text-slate-600">Role</label>
            <select
              className="mt-1 w-full cursor-pointer rounded-full border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="startup">Startup</option>
              <option value="talent">Talent</option>
            </select>
          </div>

          {/* ERROR */}
          {registerMutation.isError && (
            <p className="text-sm text-red-500">
              {registerMutation.error?.response?.data?.message || 'Register gagal'}
            </p>
          )}

          {/* BUTTON */}
          <div className="flex justify-center items-center">
            <button
              type="submit"
              style={{ fontFamily: "inter" }}
              disabled={registerMutation.isPending}
              className="w-90 rounded-full cursor-pointer bg-yellow-400 py-3 font-semibold hover:bg-yellow-500 transition disabled:bg-yellow-300"
            >
              {registerMutation.isPending ? 'Loading...' : 'Register'}
            </button>
          </div>
        </form>

        <p style={{ fontFamily: "inter" }} className="mt-6 text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 font-medium">
            Sign in
          </Link>
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden lg:flex items-center justify-center p-8">
        <div className="relative rounded-3xl overflow-hidden">
          <img
            src="image/register-img.png"
            alt="register"
            className="w-full h-full object-cover"
          />

          {/* CLOSE */}
          <div className="absolute top-4 right-4 text-2xl cursor-pointer">
            <Link to="/">
              <IoClose size={50} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}