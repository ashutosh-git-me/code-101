import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Mock Server-Side 24-Hour TTL Cron logic outline
// In a real Vercel environment, this would be triggered by a Vercel Cron Job configured in vercel.json.

const DB_PATH = path.join(process.cwd(), 'mock_db.json');

export async function GET() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return NextResponse.json({ message: 'No data to clear.' });
    }

    const fileData = fs.readFileSync(DB_PATH, 'utf-8');
    if (!fileData) {
      return NextResponse.json({ message: 'No data to clear.' });
    }

    const data: any[] = JSON.parse(fileData);
    
    // Calculate 24 hours ago
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    // Filter out records older than 24 hours
    const filteredData = data.filter((item) => {
      if (!item.timestamp) return false;
      const itemDate = new Date(item.timestamp);
      return itemDate >= twentyFourHoursAgo;
    });

    const deletedCount = data.length - filteredData.length;
    
    // Write back the filtered data
    fs.writeFileSync(DB_PATH, JSON.stringify(filteredData, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: `24-Hour TTL Cron executed. Permanently wiped ${deletedCount} expired records.` 
    });
  } catch (error) {
    console.error('Cron error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
