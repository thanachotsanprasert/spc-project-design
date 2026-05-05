import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from 'recharts'

const data = [
  { day: 'Mon', value: 12000 },
  { day: 'Tue', value: 15400 },
  { day: 'Wed', value: 18200 },
  { day: 'Thu', value: 14500 },
  { day: 'Fri', value: 21000 },
  { day: 'Sat', value: 25800 },
  { day: 'Sun', value: 22400 },
];

export default function RevenueChart() {
  const maxVal = useMemo(() => Math.max(...data.map(d => d.value)), []);

  return (
    <div className="h-[150px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={({ x, y, payload }) => (
              <text 
                x={x} 
                y={(y as number) + 12} 
                textAnchor="middle" 
                fill={payload.value === data.find(d => d.value === maxVal)?.day ? '#1A2333' : '#9AA3AE'}
                style={{ fontSize: '10px', fontWeight: payload.value === data.find(d => d.value === maxVal)?.day ? 'bold' : 'normal' }}
              >
                {payload.value}
              </text>
            )}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.value === maxVal ? '#3D4A5C' : '#D0D5DE'} 
              />
            ))}
            <LabelList 
              dataKey="value" 
              position="top" 
              content={({ x, y, value, width }: any) => (
                <text 
                  x={(x as number) + (width as number) / 2} 
                  y={(y as number) - 8} 
                  textAnchor="middle" 
                  fill={value === maxVal ? '#3D4A5C' : '#9AA3AE'} 
                  style={{ fontSize: '9px', fontWeight: value === maxVal ? 'bold' : 'normal' }}
                >
                  {value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
                </text>
              )}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
