import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (username === 'admin' && password === '12345') {
      const token = jwt.sign({ id: 1, username }, process.env.JWT_SECRET || 'default-secret', {
        expiresIn: '1h'
      })

      const response = NextResponse.json(
        { success: true, message: 'Login successful' },
        { status: 200 }
      )

      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 99999
      })

      return response
    }

    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    )
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
