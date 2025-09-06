import { useEffect, useState } from 'react';
import { RoomTestApp } from './components/ai-test2';
// import { AITestApp } from './components/ai-test';


function App() {
  const [data, setData] = useState<string>("");

  useEffect(() => {
    // 環境変数を読み込む
    const apiUrl = import.meta.env.VITE_API_URL;
    
    // API呼び出しの例
    fetch(`${apiUrl}/`)
      .then(response => response.json())
      .then(data => setData(data.message))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // return (
  //   <div>
  //     <h1>React App</h1>
  //     {data ? <p>Data from API: {data}</p> : <p>Loading...</p>}
  //   </div>
  // );
  // return <AITestApp />;
  return <RoomTestApp />;
}

export default App;