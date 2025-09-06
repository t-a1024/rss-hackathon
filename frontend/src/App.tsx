import CssBaseline from "@mui/material/CssBaseline"; //ブラウザのデフォルトのスタイルを打ち消す用
import OneLineInputField from "./components/OneLineInputField/OneLineInputField.tsx";

function App() {
  return (
    <>
      <CssBaseline />
      <div>
        <OneLineInputField placeholder="Input your name." setText={(text:string)=>{}}/>
      </div>
    </>
  )
}

export default App;