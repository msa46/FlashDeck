import {
    useMutation,
  } from '@tanstack/react-query'
import { css } from "../../styled-system/css"
import axios from 'axios'
import { useState } from 'react'
import { vstack } from '../../styled-system/patterns'


const Sync = () => {
    const baseUrl = import.meta.env.VITE_APP_URL + "/api/flashDeck"
    const deckUrl = baseUrl + localStorage.getItem("pid")
    const [newPid, setNewPid] = useState(localStorage.getItem("sync") || "create")
    const [prevSyncState, setPrevSyncState] = useState("create")
    const [url, setUrl] = useState(baseUrl)
    const [method, setMethod] = useState("POST")
   
    const syncMutation = useMutation({
        mutationFn: () => {
            return axios({
                method: method,
                url: url,
                data: {
                    pid: localStorage.getItem("pid"),
                    flashCards: localStorage.getItem("flashCards"),
                    signedSecret: localStorage.getItem("signedSecret"),
                }
            })

        },
      })
    if (localStorage.getItem("sync") === null ){
        localStorage.setItem("sync", "create")
    }
    else if (localStorage.getItem("sync") === "update"){
        setUrl(deckUrl)
        setMethod("PATCH")
    }
    const onSyncClick = () => {
        if (localStorage.getItem("sync") === "create"){
            syncMutation.mutate()
            localStorage.setItem("sync", "1")
        } else if (localStorage.getItem("sync") === "update"){
            syncMutation.mutate()
        }
        else {
            console.log("warning")
        }
    }
    if (syncMutation.isSuccess === true) {
        if(localStorage.getItem("sync") === "create"){
            localStorage.setItem("flashCards", JSON.stringify(syncMutation.data.data))
        }
        else {
            localStorage.setItem("flashCards", JSON.stringify(syncMutation.data.data.flashCards))
        }
    }
    
    return (
        <div className={vstack({})}>
            <button 
            onClick={onSyncClick}
            className={css({
                bg: "teal.700",
                p: "2",
                w: "full",
                borderRadius: "lg",
                textAlign:"center",

                _hover: {bg: 'teal.600'}
            })}
            >
               Sync
            </button>
            <input 
            type="text" 
            value={newPid} 
            onChange={(e) => setNewPid(e.target.value)} 
            onBlur={() => localStorage.setItem("sync", "retrieve")}
            className={css({
                bg: "stone.500",
                p: "2",
                w: "full",
                borderRadius: "lg",
                textAlign:"center",
            })}
            />
        </div>
    )
}

export default Sync