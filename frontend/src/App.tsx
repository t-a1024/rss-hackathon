import { useEffect, useState } from 'react';
import OneLineInputField from "./components/OneLineInputField/OneLineInputField.tsx";

function App() {
  return (
    <>
      <div>
        <OneLineInputField placeholder="Input your name." setText={(text:string)=>{}}/>
      </div>
    </>
  )
}

export default App;