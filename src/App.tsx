import { useState } from "react"

import { css } from "../styled-system/css"
import {  divider, hstack, vstack } from "../styled-system/patterns"

import Edit from "./components/Edit"
import FlashCards from "./components/FlashCards"
import Sync from "./components/Sync"

import { v4 } from 'uuid'
import { AES } from 'crypto-js'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"


const queryClient = new QueryClient()

function App() {
  const [page, setPage] = useState("main")
  
  const onMainClick = () => {
    setPage("main")
  }
  
  const onEditClick = () => {
    setPage("edit")
  }

  const onSyncClick = () => {
    setPage("sync")
  }
  
  if (localStorage.getItem("pid") === null ){
    const pid = Math.floor(Math.random() * 1000000000);
    const key = v4()
    const signedSecret = AES.encrypt(String(pid), key).toString()
    
    localStorage.setItem("pid", String(pid))
    localStorage.setItem("key", key)
    localStorage.setItem("signedSecret", signedSecret)

  }

  const navButtonStyle = css({
  // p: "8",
  w: "full",
  textAlign:"center",
  
  _hover: {bg: 'stone.700'}

  })

  return (
    <QueryClientProvider client={queryClient}>
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
      <div className={divider({
        orientation: "vertical", 
        color: "gray",
        h: "70%",
        w:"1",

        // m: "2",
        
      })} 
      />
         <button className={navButtonStyle} onClick={onSyncClick}>
        sync
      </button>
    </div>
    {(page === "main") && <FlashCards/>}
    {(page === "edit") && <Edit />}
    {(page === "sync") && <Sync />}

      
    </div>
    </QueryClientProvider>
  )
}

export default App
