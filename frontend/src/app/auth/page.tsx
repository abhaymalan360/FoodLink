'use client'

import { useState } from 'react'
import { login, signup } from './actions'
import { Utensils, HeartHandshake } from 'lucide-react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [role, setRole] = useState<'ngo' | 'restaurant'>('restaurant')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    
    if (!isLogin) {
      formData.append('role', role)
    }

    try {
      const result = isLogin ? await login(formData) : await signup(formData)
      
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      } else if (result?.url) {
        router.push(result.url)
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.')
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?role=${role}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-neutral-900 border border-neutral-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />
        
        <div className="text-center mb-8 pt-2">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            {isLogin ? 'Welcome back' : 'Join FoodLink'}
          </h1>
          <p className="text-neutral-400 text-sm">
            {isLogin ? 'Sign in to continue making an impact.' : 'Create an account to start sharing or receiving food.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-4 mb-6">
              <label className="block text-sm font-medium text-neutral-300">I want to...</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('restaurant')}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${
                    role === 'restaurant' 
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 scale-105' 
                      : 'border-neutral-800 hover:border-neutral-700 text-neutral-400 bg-neutral-950'
                  }`}
                >
                  <Utensils size={28} />
                  <span className="text-sm font-medium">Donate Food</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('ngo')}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${
                    role === 'ngo' 
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 scale-105' 
                      : 'border-neutral-800 hover:border-neutral-700 text-neutral-400 bg-neutral-950'
                  }`}
                >
                  <HeartHandshake size={28} />
                  <span className="text-sm font-medium">Receive Food</span>
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Organization Name</label>
                <input
                  name="name"
                  required
                  type="text"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-neutral-600"
                  placeholder="e.g. Green Earth Shelter"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Email</label>
            <input
              name="email"
              required
              type="email"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-neutral-600"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Password</label>
            <input
              name="password"
              required
              type="password"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-neutral-600"
              placeholder="••••••••"
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3.5 rounded-xl transition-all disabled:opacity-50 mt-4 active:scale-[0.98] shadow-lg shadow-emerald-500/20"
          >
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center space-x-2">
          <span className="h-px w-full bg-neutral-800"></span>
          <span className="text-sm text-neutral-500">or</span>
          <span className="h-px w-full bg-neutral-800"></span>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full mt-6 bg-neutral-950 border border-neutral-800 hover:bg-neutral-800 text-white font-medium py-3.5 rounded-xl transition-all disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-3"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="mt-8 text-center border-t border-neutral-800 pt-6">
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setError(null)
            }}
            className="text-neutral-400 hover:text-emerald-400 text-sm transition-colors font-medium"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
