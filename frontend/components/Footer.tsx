import React from 'react'
import { Button } from './ui/button';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="p-12 gap-2 bg-brand-black text-brand-beige">
      <p className="text-5xl font-bold">いい感じの言葉</p>
      <p className="mt-6">いい感じの謳い文句</p>
      <div className="border-t-brand-beige/30 border-t-2 w-full mt-16 mb-8"></div>
      <p className="text-sm text-muted-foreground">
      ©2026 CODE MATES
      </p>

    </footer>
  )
}

export default Footer