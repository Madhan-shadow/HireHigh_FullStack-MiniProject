import React, { useState } from 'react'

const App1 = () => {
    let a=100
    let[count,setCount]=useState(0);
  return (
    <div align = "center">
        <h1 style={{color:"green"}}>It's Worked</h1>
        <h1>{a}/10</h1>
        </div>
  ) 
}
export default App1