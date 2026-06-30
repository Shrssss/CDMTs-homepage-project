import React from 'react'

const TypoGraphyWrapper = ({children}:{children:React.ReactNode}) => {
  return (
    <div className="typography mx-auto max-w-3xl">
      {children}
    </div>
  )
}

export default TypoGraphyWrapper