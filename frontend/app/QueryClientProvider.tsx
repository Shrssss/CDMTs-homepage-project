'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { enableMocking, isMockingEnabled } from '@/mocks/enableMocking'

export default function Provider(
  { children } : { children: React.ReactNode }
) {
  const queryClient = new QueryClient()
  // MSW を使う場合は worker の起動を待ってから描画する（最初のリクエストが実際のAPIに飛ばないように）
  const [isReady, setIsReady] = useState(!isMockingEnabled)

  useEffect(() => {
    if (isReady) return
    // 起動に失敗しても画面が真っ白にならないよう、エラーを出して描画は続ける
    enableMocking()
      .catch((e) => console.error('[MSW] 起動に失敗しました', e))
      .finally(() => setIsReady(true))
  }, [isReady])

  if (!isReady) return null

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
