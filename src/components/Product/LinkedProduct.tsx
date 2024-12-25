import React from 'react'
import { Result } from 'antd'

type Props = {}

export default function LinkedProduct({}: Props) {
  return (
    <div> 
         <Result
        status="404"
        title="Page Not Found"
        subTitle="PulseZest is working.. It will Update soon!"
      />
    </div>
  )
}