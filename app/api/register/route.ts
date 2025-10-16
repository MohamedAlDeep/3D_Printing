import { NextResponse } from "next/server"
import {prisma} from '@/lib/prisma'
import bcrypt, { hash } from "bcryptjs"

export async function POST(req: Request) {
  const data = await req.json()
  const { firstName, lastName, email, password, gender, phone } = data

  async function hashPassword(plainPassword: string){
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(plainPassword, salt)
    return hashed
  }

  try {
    const user = await prisma.user.create({
       data: {
        email: email,
        name: firstName + ' ' + lastName,
        password: await hashPassword(password),
        gender: gender,
        phone: phone,
        createdAt: new Date(),
        type: 'customer',
      },
    })
    return NextResponse.json({ success: true, user })
    
    }catch (error: any) {
        console.error('❌ Prisma error:', error); // Log it
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
