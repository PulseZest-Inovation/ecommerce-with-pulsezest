import React from 'react'
import { LoadingOutlined } from '@ant-design/icons';
import {  Spin } from 'antd';
 

export default function Loader() {
  return (
    <div> 
        <div className='flex items-center justify-center h-screen'>
     <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
  </div>
    </div>
  )
}