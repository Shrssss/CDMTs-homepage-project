import Link from 'next/link'
import React from 'react'

// ヘッダーコンポーネント
const Header = () => {
  return (
    <header className='sticky w-full top-0 border-b border-b-black/10 backdrop-blur-sm p-4 flex gap-2'>
      <Link className='font-bold text-xl' href={"/"}>ヘッダー</Link>
      <div className='flex gap-2'>
        <Link href="/members">メンバー</Link>
        <Link href="/news">ニュース</Link>
      </div>
    </header>
  )
}

export default Header