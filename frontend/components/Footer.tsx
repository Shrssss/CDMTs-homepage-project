import React from 'react'
import { Button } from './ui/button';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="max-w-6xl mx-auto p-4 flex justify-between gap-2">
      <p className="text-sm text-muted-foreground">
      ©2026 CODE MATES
      </p>
      <Button variant={"link"} asChild>
        <Link href={"contact"}>お問い合わせ</Link>
      </Button>
    </footer>
  )
}

export default Footer