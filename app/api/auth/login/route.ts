import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const { email, password, role } = await req.json();
        const user = validateCredentials(email, password, role);

        if (!user) {
            return NextResponse.json({ success: false, message: 'Invalid credentials. Check email & password.' }, { status: 401 });
        }

        return NextResponse.json({ success: true, user });
    } catch {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
