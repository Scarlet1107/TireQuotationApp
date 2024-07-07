import React from 'react'
import Header from '@/components/Header'

const page = () => {
    const handleClick = async () => {
        const res = await fetch('/api/deleteAll')
        const data = await res.json()
        console.log(data)
    }
  return (
    <div>
      <Header />
      <button onClick={() => handleClick()}>テーブルのデータをすべて削除する</button>
    </div>
  )
}

export default page