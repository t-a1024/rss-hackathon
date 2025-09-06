import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Heading from "../src/components/Heading/Heading"
import Text from "../src/components/Text/text";
import { IntegerStepperField, BirthdateDatePicker, type Birthdate } from "./components/IntegerInputField/IntegerInputField";
function App() {
  const [count, setCount] = useState(0)
  const [birth, setBirth] = useState<Birthdate>({ year: null, month: null, day: null });

  return (
    <>

      <div>
        <Heading
          as="h1"
          size="display"
          eyebrow="Release notes"
          subtitle="このページでは最新の変更点をまとめています。"
          gradient
          align="center"
        >
          Tailwind + React Heading
        </Heading>

        <Heading as="h2" size="lg" weight="semibold">
          セクション見出し（左寄せ・標準色）
        </Heading>

        <Heading as="h3" size="md" align="right" subtitle="右寄せ・補助文つき">
          右寄せ見出し
        </Heading>

        <div className="space-y-4 p-6">
      <IntegerStepperField
        value={count}
        onChange={setCount}
        min={-5}
        max={10}
        step={1}
        size="sm"
        inputClassName="w-10"
      />

      <BirthdateDatePicker
                value={birth}
                onChange={setBirth}
                minYear={1900}
                maxYear={new Date().getFullYear()}
        
      />
       <Text>デフォルト（本文）</Text>
      <Text size="sm" tone="muted">補助テキスト（小・薄め）</Text>
      <Text size="xl" weight="semibold">大きめ・セミボールド</Text>
      <Text as="span" underline italic>インラインで装飾</Text>
      <Text as="a" href="/terms" tone="info" underline>利用規約</Text>
    </div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
