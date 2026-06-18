import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: NextRequest) {
  try {
    const { code, deviceFingerprint, deviceInfo } = await req.json();

    if (!code || !deviceFingerprint) {
      return NextResponse.json(
        { valid: false, error: 'Missing code or device fingerprint' },
        { status: 400 }
      );
    }

    // 1. Check if license exists and is active
    const { data: license, error: licenseError } = await supabase
      .from('licenses')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('status', 'active')
      .single();

    if (licenseError || !license) {
      return NextResponse.json(
        { valid: false, error: 'Invalid or inactive license code' },
        { status: 403 }
      );
    }

    // Check expiration
    if (license.expires_at && new Date(license.expires_at) < new Date()) {
      return NextResponse.json(
        { valid: false, error: 'Tu licencia ha vencido. Contactá al administrador para renovarla.' },
        { status: 403 }
      );
    }

    // 2. Check if this device is already activated
    const { data: existingActivation } = await supabase
      .from('activations')
      .select('*')
      .eq('license_code', code.toUpperCase())
      .eq('device_fingerprint', deviceFingerprint)
      .single();

    if (existingActivation) {
      // Device already activated — update last_verified_at and allow
      await supabase
        .from('activations')
        .update({ last_verified_at: new Date().toISOString() })
        .eq('id', existingActivation.id);

      return NextResponse.json({ valid: true, message: 'Device already activated' });
    }

    // 3. Check if max activations reached
    if (license.activations_used >= license.max_activations) {
      return NextResponse.json(
        { valid: false, error: 'Maximum activations reached for this license' },
        { status: 403 }
      );
    }

    // 4. Register new activation
    const { error: activationError } = await supabase
      .from('activations')
      .insert({
        license_code: code.toUpperCase(),
        device_fingerprint: deviceFingerprint,
        device_info: deviceInfo || null,
      });

    if (activationError) {
      return NextResponse.json(
        { valid: false, error: 'Failed to register activation' },
        { status: 500 }
      );
    }

    // 5. Increment activations_used
    await supabase
      .from('licenses')
      .update({ activations_used: license.activations_used + 1 })
      .eq('code', code.toUpperCase());

    return NextResponse.json({ valid: true, message: 'License activated successfully' });

  } catch {
    return NextResponse.json(
      { valid: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
