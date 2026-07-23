import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Using local JSON file as a persistent mock DB
const DB_PATH = path.join(process.cwd(), 'mock_db.json');

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // Required fields check (schema validation)
    if (!payload.event_id || !payload.location || !payload.asset || !payload.action_flag) {
      return NextResponse.json({ error: 'Invalid payload schema' }, { status: 400 });
    }

    // Read existing
    let data = [];
    if (fs.existsSync(DB_PATH)) {
      const fileData = fs.readFileSync(DB_PATH, 'utf-8');
      if (fileData) {
        data = JSON.parse(fileData);
      }
    }

    // Append new
    data.push(payload);

    // Keep only last 100 for memory safety in MVP
    if (data.length > 100) {
      data = data.slice(data.length - 100);
    }

    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true, event_id: payload.event_id }, { status: 201 });
  } catch (error) {
    console.error('Ingest error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
