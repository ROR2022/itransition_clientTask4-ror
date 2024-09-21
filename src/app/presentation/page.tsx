import React from 'react'
import dynamic from 'next/dynamic'
//import Presentation from '@/components/Presentation/Presentation'
const Presentation = dynamic(() => import('@/components/Presentation/Presentation'), { ssr: false })

const page = () => {
  return (
    <div>
        <Presentation />
    </div>
  )
}

export default page