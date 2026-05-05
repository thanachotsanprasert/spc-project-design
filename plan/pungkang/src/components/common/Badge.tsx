import React from 'react'

interface BadgeProps {
  label: string;
  bg: string;
  text: string;
  border?: string;
  className?: string;
}

export default function Badge({ label, bg, text, border, className = '' }: BadgeProps) {
  return (
    <span 
      className={`text-[10px] py-[2px] px-2 rounded-full font-medium text-center inline-block ${className}`}
      style={{ 
        backgroundColor: bg, 
        color: text, 
        border: border ? `1px solid ${border}` : 'none' 
      }}
    >
      {label}
    </span>
  )
}
