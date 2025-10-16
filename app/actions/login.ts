// app/actions/login.ts
'use server'

import { redirect } from 'next/navigation'
import { loginValidate } from '@/lib/auth'

export async function loginAction(formData: FormData) {
  await loginValidate(formData)
  console.log('Ran login validation')
  redirect('/login')
}
