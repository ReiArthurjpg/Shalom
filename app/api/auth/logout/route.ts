import { NextResponse } from 'next/server'
import { REFRESH_COOKIE_NAME, SESSION_COOKIE_NAME } from '@/lib/constants'

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Cookies de sessão removidos.',
  })

  for (const name of [SESSION_COOKIE_NAME, REFRESH_COOKIE_NAME]) {
    response.cookies.set(name, '', {
      path: '/',
      maxAge: 0,
      expires: new Date(0),
      sameSite: 'lax',
    })
  }

  return response
}