import { NextResponse } from 'next/server';

// In-memory array acting as Mock Database (Persists during development container lifecycle)
let telemetryDatabase: any[] = [];

// TASK: Universal CORS Handlers for Edge Node Ngrok Integrations
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, ngrok-skip-browser-warning, x-edge-token',
};

// SECURITY: Validate the Edge Node bearer token on write operations
function authenticateEdgeNode(req: Request): boolean {
  const token = req.headers.get('x-edge-token');
  const secret = process.env.EDGE_SECRET_TOKEN;
  // In development, if no secret is configured, allow all requests
  if (!secret) return true;
  return token === secret;
}

// GEO: Haversine formula — returns distance in meters between two GPS coordinates
function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function DELETE(req: Request) {
  if (!authenticateEdgeNode(req)) {
    return NextResponse.json({ error: 'Unauthorized: Invalid or missing x-edge-token' }, { status: 401, headers: corsHeaders });
  }

  telemetryDatabase = [];
  return NextResponse.json({ success: true, message: 'All telemetry wiped globally.' }, { status: 200, headers: corsHeaders });
}

export async function GET() {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  // CRITICAL PRIVACY CONSTRAINT: Filter records older than 24 hours
  telemetryDatabase = telemetryDatabase.filter((record) => {
    if (!record.timestamp) return false;
    const recordDate = new Date(record.timestamp);
    return recordDate >= twentyFourHoursAgo;
  });

  return NextResponse.json({ data: telemetryDatabase }, { headers: corsHeaders });
}

export async function POST(req: Request) {
  // SECURITY GATE: Reject unauthenticated Edge Nodes
  if (!authenticateEdgeNode(req)) {
    return NextResponse.json({ error: 'Unauthorized: Invalid or missing x-edge-token' }, { status: 401, headers: corsHeaders });
  }

  try {
    const payload = await req.json();

    // Basic schema validation
    // Schema now accepts optional location.route_trace: [{lat: number, lng: number}] for LIVE_DIVERSION
    if (!payload.event_id || !payload.location || !payload.asset || !payload.action_flag) {
      return NextResponse.json({ error: 'Invalid payload schema' }, { status: 400, headers: corsHeaders });
    }

    // Bug fix: Enforce strict string typing for location.segment
    if (typeof payload.location.segment !== 'string') {
      return NextResponse.json({ error: 'location.segment must be strictly typed as a string' }, { status: 400, headers: corsHeaders });
    }

    // Determine if this payload is a resolution signal
    const isResolutionSignal =
      payload.action_flag === 'HEALTHY' ||
      payload.action_flag === 'OK' ||
      payload.incident?.severity === 'RESOLVED' ||
      payload.incident?.severity === 'HEALTHY';

    // Bug fix: Re-classify improperly flagged resolution payloads if reflectivity says otherwise
    if (isResolutionSignal) {
      if (
        payload.asset.reflectivity_mcd !== undefined &&
        payload.asset.baseline_mcd !== undefined &&
        payload.asset.reflectivity_mcd < payload.asset.baseline_mcd
      ) {
        // Reflectivity is still degraded — this is NOT actually healthy
        payload.action_flag = 'CRITICAL_DEGRADATION';
      }
    }

    // Re-evaluate after possible reclassification
    const stillResolution =
      payload.action_flag !== 'CRITICAL_DEGRADATION' && isResolutionSignal;

    if (stillResolution) {
      // TASK 1: Geo-proximity auto-resolve within 50-meter radius (Haversine)
      const incomingLat = payload.location.lat;
      const incomingLng = payload.location.lng;

      const matchingIndex = telemetryDatabase.findIndex((record) => {
        // Only resolve active (non-resolved) tickets
        if (
          record.action_flag === 'VERIFIED_RESOLVED' ||
          record.action_flag === 'HEALTHY' ||
          record.action_flag === 'OK'
        ) {
          return false;
        }

        const dist = haversineMeters(
          incomingLat,
          incomingLng,
          record.location.lat,
          record.location.lng
        );
        return dist <= 50;
      });

      if (matchingIndex !== -1) {
        // Resolve the matching ticket in-place — do NOT create a duplicate
        telemetryDatabase[matchingIndex] = {
          ...telemetryDatabase[matchingIndex],
          action_flag: 'VERIFIED_RESOLVED',
          resolved_at: new Date().toISOString(),
          resolved_by: payload.event_id,
        };
        return NextResponse.json(
          {
            success: true,
            message: `Auto-resolved ticket ${telemetryDatabase[matchingIndex].event_id} within 50m radius`,
            event_id: payload.event_id,
          },
          { status: 201, headers: corsHeaders }
        );
      }
      // No nearby match — fall through and insert normally
    }

    // All other payloads (including unmatched resolutions) get added
    telemetryDatabase.unshift(payload);

    // Safety cap: pop if exceeds 1000 items to prevent memory leaks
    if (telemetryDatabase.length > 1000) {
      telemetryDatabase.pop();
    }

    return NextResponse.json({ success: true, event_id: payload.event_id }, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error('Ingest error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: corsHeaders });
  }
}
