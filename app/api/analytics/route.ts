import { NextResponse } from 'next/server'
import { query } from '../../../lib/db'

const fallbackAnalytics = {
  totalSales: 154200000,
  currency: 'IDR',
  hotItems: [
    { name: 'Single Origin Espresso', sales: 128 },
    { name: 'Pour Over', sales: 115 },
    { name: 'Cappuccino', sales: 96 },
    { name: 'Cold Brew', sales: 84 },
    { name: 'Almond Croissant', sales: 73 },
  ],
}

export async function GET() {
  try {
    const salesResult = await query<{ total_sales: number; currency: string }[]>(
      'SELECT total_sales, currency FROM store_summary ORDER BY updated_at DESC LIMIT 1'
    )

    const hotItems = await query<{ item_name: string; sales: number }[]>(
      'SELECT item_name, sales FROM hot_items ORDER BY sales DESC LIMIT 5'
    )

    const response = {
      totalSales: salesResult[0]?.total_sales ?? 0,
      currency: salesResult[0]?.currency ?? 'IDR',
      hotItems: hotItems.map((item) => ({ name: item.item_name, sales: item.sales })),
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(fallbackAnalytics)
  }
}
