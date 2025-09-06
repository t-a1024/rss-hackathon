import CssBaseline from "@mui/material/CssBaseline"; //ブラウザのデフォルトのスタイルを打ち消す用
import OneLineInputField from "./components/OneLineInputField/OneLineInputField.tsx";
import TextInputField from "./components/TextInputField/TextInputField.tsx";
import Button from "./components/Button/Button.tsx";
import "./util.css";
import { useEffect, useState } from "react";
import { getAPI, postAPI } from "./util/apiservice.ts";

function App() {
    const [data, setData] = useState<string>("");
    const [postData, setPostData] = useState<string>("");
    const sendData = {
    "members": [
      {
        "name": "Alice",
        "age": 25,
        "hometown": "Tokyo",
        "organization": "University of Tokyo",
        "motivation": "I want to improve my AI development skills."
      },
      {
        "name": "Bob",
        "age": 28,
        "hometown": "Osaka",
        "organization": "Osaka IT Company",
        "motivation": "I enjoy working in a team and want to challenge myself."
      },
      {
        "name": "Charlie",
        "age": 22,
        "hometown": "Nagoya",
        "organization": "Nagoya College",
        "motivation": "I want to learn how to manage projects effectively."
      }
    ]
  }
    useEffect(() => {    
      // getAPI呼び出しの例
      getAPI("api/roles").then(data=>{
        setData(data);
      })

      postAPI("api/roles/assign",sendData).then(data=>{
        setPostData(data);
      })
    }, []);
  return (
    <>
      <CssBaseline />
      <div>
        <OneLineInputField placeholder="Input your name." setText={(text:string)=>{}}/>
        <TextInputField placeholder="Input your name." rows={5} cols={10} setText={(text:string)=>{}}/>
        <Button text="Submit" onClickFunc={()=>{}}/>
        {data ? <p>Data from API: {JSON.stringify(data)}</p> : <p>Loading...</p>}
        {postData ? <p>Data from API Posting: {JSON.stringify(postData)}</p> : <p>Loading...</p>}
      </div>
    </>
  )
}

export default App;