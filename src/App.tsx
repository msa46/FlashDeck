import { useState } from "react"

import { css } from "../styled-system/css"
import {  divider, hstack, vstack } from "../styled-system/patterns"

import Edit from "./components/Edit"
import FlashCards from "./components/FlashCards"
import { v4 } from 'uuid'


function App() {
  const [page, setPage] = useState("main")
  
  const onMainClick = () => {
    setPage("main")
  }
  
  const onEditClick = () => {
    setPage("edit")
  }
  
  if (localStorage.getItem("pid") === null ){
    const pid = v4()
    
    localStorage.setItem("pid", pid)

  }

  const navButtonStyle = css({
  // p: "8",
  w: "full",
  textAlign:"center",
  
  _hover: {bg: 'stone.700'}

  })

  return (
    <div className={vstack({
      bg: "stone.900",
      h: "screen",
      w: "full",
      color: "white",
      
    })}>
    <div className={hstack({
     bg: "stone.800",
     w: "50%",
     display:"flex",
     maxWidth: "100%",
     justify: "center",
    })}>
      <button className={navButtonStyle} onClick={onMainClick}>
        main
      </button>
      <div className={divider({
        orientation: "vertical", 
        color: "gray",
        h: "70%",
        w:"1",

        // m: "2",
        
      })} 
      />
      <button className={navButtonStyle} onClick={onEditClick}>
        edit
      </button>
    </div>
    {page === "main" ? 
      <FlashCards />
      :
      <Edit />
    }
      
    </div>
  )
}

export default App
