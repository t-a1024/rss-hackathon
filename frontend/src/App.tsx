import CssBaseline from "@mui/material/CssBaseline"; //ブラウザのデフォルトのスタイルを打ち消す用
import OneLineInputField from "./components/OneLineInputField/OneLineInputField.tsx";
import TextInputField from "./components/TextInputField/TextInputField.tsx";
import Button from "./components/Button/Button.tsx";
import "./util.css";

function App() {
  return (
    <>
      <CssBaseline />
      <div>
        <OneLineInputField placeholder="Input your name." setText={(text:string)=>{}}/>
        <TextInputField placeholder="Input your name." rows={5} cols={10} setText={(text:string)=>{}}/>
        <Button text="Submit" onClickFunc={()=>{}}/>
      </div>
    </>
  )
}

export default App;