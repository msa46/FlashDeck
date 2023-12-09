import { useState } from 'react'

import './App.css'

function App() {
  const [page, setPage] = useState("main")
  
  const onMainClick = () => {
    setPage("main")
  }
  
  const onEditClick = () => {
    setPage("edit")
  }
  return (
    <>
    <button onClick={onMainClick}>
      main
    </button>
    <button onClick={onEditClick}>
       edit
    </button>
     {page === "main" ? 
      <div>
       main
      </div>
      :
      <div>
        edit
      </div>  
    }
      
    </>
  )
}

export default App
