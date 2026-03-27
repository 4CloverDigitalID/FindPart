import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { IoClose } from "react-icons/io5"


import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

function getNextPath(user) {
  if (user?.role === 'startup' && !user?.startup_profile) {
    return '/onboarding/startup'
  }

  if (user?.role === 'talent' && !user?.talent_profile) {
    return '/onboarding/talent'
  }

  return '/dashboard'
}

export default function Login() {
  const { loginMutation } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    if (loginMutation.data?.user) {
      const destination = location.state?.from?.pathname || getNextPath(loginMutation.data.user)

      if (destination === '/dashboard') {
        sessionStorage.setItem('showDashboardIntro', '1')
      }

      navigate(destination, { replace: true })
    }
  }, [loginMutation.data, location.state, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await loginMutation.mutateAsync(form)
    } catch (error) {}
  }

  return (
    <div className="h-screen flex">
      
      {/* LEFT SIDE */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-10 lg:px-20">
        
        {/* Logo */}
        <div className="mb-8 flex items-center gap-2">
          <img className='' src="image/icon-login.png" alt="Logo" />
        </div>

        <h1 style={{ fontFamily: 'inter' }} className="text-4xl font-semibold text-slate-900">
          Welcome back
        </h1>
        <p style={{ fontFamily: "inter" }} className="mt-2 text-slate-600">
          Ready to find your future business partners?
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          
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
            <label  className="text-sm text-slate-600">Password</label>
            <input
              type="password"
              placeholder="8 Character"
              style={{ fontFamily: "inter" }}
              className="mt-1 w-full rounded-full border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {/* ERROR */}
          {loginMutation.isError && (
            <p className="text-sm text-red-500">
              {loginMutation.error?.response?.data?.message || 'Login gagal'}
            </p>
          )}

          {/* BUTTON */}
          <div className='flex justify-center items-center'>
            <button
              style={{ fontFamily: "inter" }}
              type="submit"
              disabled={loginMutation.isPending}
              className="w-90 rounded-full bg-yellow-400 py-3 font-semibold hover:bg-yellow-500 transition cursor-pointer disabled:bg-yellow-300 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? 'Loading...' : 'Login'}
            </button>
          </div>
        </form>

        <p style={{ fontFamily: "inter" }} className="mt-6 text-sm text-slate-500">
          Don’t have an account?{' '}
          <Link to="/register" className="text-blue-500 font-medium">
            Sign up
          </Link>
        </p>
      </div>

      {/* RIGHT SIDE (IMAGE) */}
      <div className="hidden lg:flex  items-center justify-center p-8">
        <div className="relative ] rounded-3xl overflow-hidden">
          <img
            src="image/login-img.png"
            alt="login"
            className="w-full h-full object-cover"
          />
          
          {/* CLOSE ICON */}
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
