'use client';
import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function Login() {
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  return (
    <main className="card max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Přihlášení</h1>
      <div className="space-y-3">
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" placeholder="Heslo" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn w-full" onClick={()=>signIn('credentials',{ email, password, callbackUrl: '/'})}>Přihlásit</button>
      </div>
    </main>
  )
}
