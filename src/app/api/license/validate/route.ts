import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { calculateExpiresAt, type PlanKey } from '@/lib/planConfig';

export async function POST(req: NextRequest) {
  try {
    const { code, deviceFingerprint, deviceInfo } = await req.json();

    if (!code || !deviceFingerprint) {
      return NextResponse.json(
        { valid: false, error: 'Missing code or device fingerprint', errorCode: 'SERVER_ERROR' },
        { status: 400 }
      );
    }

    // 1. Check if license exists (no status filter — differentiate revoked from invalid)
    const { data: license, error: licenseError } = await supabase
      .from('licenses')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (licenseError || !license) {
      return NextResponse.json(
        { valid: false, error: 'Invalid license code', errorCode: 'LICENSE_INVALID' },
        { status: 403 }
      );
    }

    if (license.status === 'revoked') {
      return NextResponse.json(
        { valid: false, error: 'License has been revoked', errorCode: 'LICENSE_REVOKED' },
        { status: 403 }
      );
    }

    if (license.status !== 'active') {
      return NextResponse.json(
        { valid: false, error: 'Invalid or inactive license code', errorCode: 'LICENSE_INVALID' },
        { status: 403 }
      );
    }

    // Check expiration
    if (license.expires_at && new Date(license.expires_at) < new Date()) {
      return NextResponse.json(
        { valid: false, error: 'Tu licencia ha vencido. Contactá al administrador para renovarla.', errorCode: 'LICENSE_EXPIRED' },
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
        { valid: false, error: 'Maximum activations reached for this license', errorCode: 'LICENSE_LIMIT_REACHED' },
        { status: 403 }
      );
    }

    // 4. If this is the first activation (expires_at is null), set expiry now
    //    based on the license plan. Subsequent activations leave it untouched.
    if (!license.expires_at) {
      const newExpiresAt = calculateExpiresAt(license.plan as PlanKey);
      await supabase
        .from('licenses')
        .update({ expires_at: newExpiresAt })
        .eq('code', code.toUpperCase())
        .is('expires_at', null);
      // Use the newly computed expiry for this request's expiration check
      license.expires_at = newExpiresAt;
    }

    // 5. Increment activations_used conditionally (compare-and-swap)
    const { data: updatedLicense } = await supabase
      .from('licenses')
      .update({ activations_used: license.activations_used + 1 })
      .eq('code', code.toUpperCase())
      .eq('activations_used', license.activations_used)
      .select();

    if (!updatedLicense || updatedLicense.length === 0) {
      return NextResponse.json(
        { valid: false, error: 'Maximum activations reached for this license', errorCode: 'LICENSE_LIMIT_REACHED' },
        { status: 403 }
      );
    }

    // 6. Register new activation
    const { error: activationError } = await supabase
      .from('activations')
      .insert({
        license_code: code.toUpperCase(),
        device_fingerprint: deviceFingerprint,
        device_info: deviceInfo || null,
      });

    if (activationError) {
      // Revert increment (rollback) if insert fails, only if counter was not modified concurrently
      const { data: rollbacked } = await supabase
        .from('licenses')
        .update({ activations_used: license.activations_used })
        .eq('code', code.toUpperCase())
        .eq('activations_used', license.activations_used + 1)
        .select();

      if (!rollbacked || rollbacked.length === 0) {
        console.error(`Rollback of activations_used failed for license ${code.toUpperCase()}: counter modified concurrently.`);
      }

      return NextResponse.json(
        { valid: false, error: 'Failed to register activation', errorCode: 'SERVER_ERROR' },
        { status: 500 }
      );
    }

    return NextResponse.json({ valid: true, message: 'License activated successfully' });

  } catch {
    return NextResponse.json(
      { valid: false, error: 'Internal server error', errorCode: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
