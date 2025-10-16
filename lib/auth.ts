import { cookies } from "next/headers"
import {SignJWT, jwtVerify} from 'jose'
import { NextRequest, NextResponse } from "next/server"
import {prisma} from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const secretKey = 'secret'
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any){
    return await new SignJWT(payload)
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime('6000 sec from now')
        .sign(key)
}

export async function decrypt(input: string): Promise<any>{
    const {payload} = await jwtVerify(input, key, {
        algorithms: ['HS256']
    })
    return payload
}

export async function login(email: string){
    const user = { email: email }
    const expires = new Date(Date.now() + 1000 * 1000)
    const session = await encrypt({user, expires})
    const cookieStore = await cookies()
 
    cookieStore.set('session', session, {expires, httpOnly: true})
    console.log("Cookies set")
}


export async function logout(){
    const cookieStore = await cookies()

    cookieStore.set('session', '', {expires: new Date(0)})
}

export async function getSession(){
    const cookieStore = await cookies()
    const session =  cookieStore.get('session')?.value
    if(!session) return null
    return await decrypt(session)
}

export async function updateSession(request: NextRequest){
    const session = request.cookies.get('session')?.value
    if(!session) return

    const parsed = await decrypt(session)
    parsed.expires = new Date(Date.now() + 300 * 1000)
    const res = NextResponse.next()
    res.cookies.set({
        name: 'session',
        value: await encrypt(parsed),
        httpOnly: true,
        expires: parsed.expires,
    })
    return res
}


export async function loginValidate(formData: FormData){
    const email = await formData.get('email') as string
    const password = await formData.get('password') as string
    const user = await prisma.user.findUnique({
        where: { email },
    })
    if(!user || !user.password){
        return null
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        return null
    }
    await login(email)
    
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.type
    }
}