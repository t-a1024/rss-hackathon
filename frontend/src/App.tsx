import CssBaseline from "@mui/material/CssBaseline"; //ブラウザのデフォルトのスタイルを打ち消す用
import QnA from "./pages/QnA/QnA.tsx";
import "./util.css";

function App() {
  return (
    <>
      <CssBaseline />
      <div>
        <QnA />
      </div>
    </>
  )
}

export default App;