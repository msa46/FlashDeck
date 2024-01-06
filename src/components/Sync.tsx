import {
    useMutation,
    useQuery,
  } from '@tanstack/react-query'
import { css } from '@shadow-panda/styled-system/css'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { vstack } from '@shadow-panda/styled-system/patterns'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from './ui/alert-dialog'
  


const Sync = () => {
    const baseUrl = import.meta.env.VITE_API_URL + "/api/flashDeck/"
    const deckUrl = baseUrl + "/" + localStorage.getItem("pid")
    const [newPid, setNewPid] = useState(localStorage.getItem("retrieveId") || "")
    const [prevSyncState, setPrevSyncState] = useState(localStorage.getItem("sync") || "")
    const [url, setUrl] = useState(baseUrl)
    const [method, setMethod] = useState("POST")
    const [isModalOpen, setModalOpen] = useState(false);
    

   
    const syncMutation = useMutation({
        mutationFn: () => {
            return axios({
                method: method,
                url: url,
                data: {
                    pid: Number(localStorage.getItem("pid")),
                    flashCards: JSON.parse(localStorage.getItem("flashCards") || ""),
                    signedSecret: localStorage.getItem("signedSecret"),
                }
            })
        
        },
        onSuccess: (response) => {
            if (localStorage.getItem("create")){
                localStorage.setItem("flashCards", JSON.stringify(response.data))
                localStorage.setItem("sync", "update")
            } else {
                localStorage.setItem("flashCards", JSON.stringify(response.data.flashCards))
            }
        },
      })
    if (localStorage.getItem("sync") === null ){
        localStorage.setItem("sync", "create")
    }
    else if (localStorage.getItem("sync") === "update" && url !== deckUrl){
        setUrl(deckUrl)
        setMethod("PATCH")
    }
    
    const {refetch} = useQuery({
        queryKey:["flashCards"], 
        queryFn: async () => {
            const response = await axios.get(baseUrl + "/" + newPid, {validateStatus : false})
            if (response.status === 200) {
                localStorage.setItem("flashCards", JSON.stringify(response.data.flashCards))
            }
            
            return response.data
        },
        enabled: false
    })

    const onSyncClick = () => {
        if (localStorage.getItem("sync") === "retrieve"){
            if (prevSyncState === "retrieve"){
                refetch()
            }

        }
        else {
            syncMutation.mutate()
        }
    }
    const checkToOpen = () => {
        if (localStorage.getItem("sync") === "retrieve" && prevSyncState !== "retrieve"){
            setModalOpen(modal => !modal)
        }
    }

    const onModalAccept = () => {
        setPrevSyncState("retrieve")
        refetch()
    }
    
    return (
        <div className={vstack({})}>
            <AlertDialog open={isModalOpen} onOpenChange={checkToOpen} >
                <AlertDialogTrigger asChild>
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
                </AlertDialogTrigger>
                <AlertDialogContent className={css({
                    shadow: "sm",
                    bg: "stone.800",
                    color: "white",
                    borderColor: "stone.600",
                })}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>You are going to retrieve a flashDeck</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action overwrites your current flashDeck. Are you sure you want to continue?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel
                    className={css({
                        bg: "stone.800",
                        border: "none",
                        _hover: {
                            color: "white",
                        },

                    })}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                    className={css({
                        bg: "zinc.500",
                    })}
                    onClick={onModalAccept}
                    >
                        Continue
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            
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