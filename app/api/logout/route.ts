import { NextResponse } from "next/server"
import { logout } from "@/lib/auth";

export async function GET(req: Request) {
    await logout()
    return NextResponse.json({success: 'Logged Out'})
}