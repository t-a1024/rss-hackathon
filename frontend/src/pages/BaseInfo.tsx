// src/pages/BaseInfo.tsx
import  {  useState } from "react";
import Text from "../components/Text/text";
import Heading from "../components/Heading/Heading";
import OneLineInputField from "../components/OneLineInputField/OneLineInputField";
import { BirthdateDatePicker, type Birthdate } from "../components/IntegerInputField/IntegerInputField";

// 補助: 表示用 YYYY-MM-DD
const pad2 = (n: number) => (n < 10 ? `0${n}` : String(n));
const formatBirthdate = (b: Birthdate) =>
  b && b.year && b.month && b.day ? `${b.year}-${pad2(b.month)}-${pad2(b.day)}` : "";

export default function BaseInfo() {
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState<Birthdate>({ year: null, month: null, day: null });
  const [age, setAge] = useState("");
  const [origin, setOrigin] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [motivation, setMotivation] = useState("");



  const handleSubmit = () => {
    // 日付を YYYY-MM-DD 文字列へ
    const birthStr = formatBirthdate(birthdate);
  
    // 年齢は数値に（不正なら null）
    const ageNum = Number.parseInt(age, 10);
    const ageValue = Number.isFinite(ageNum) ? ageNum : null;
  
    const payload = {
      name: name.trim(),
      birthdate: birthStr,          
      age: ageValue,                     
      hometown: origin.trim(),           
      affiliation: affiliation.trim(),        
      aspiration: motivation.trim(),         
    };
  
    try {
      localStorage.setItem("baseInfo", JSON.stringify(payload));
      alert("ローカルに保存しました！\n" + JSON.stringify(payload, null, 2));
    } catch (e) {
      console.error(e);
      alert("保存に失敗しました。ストレージの容量や設定を確認してください。");
    }
  };

  return (
    <main className="min-h-screen w-screen flex items-start sm:items-center justify-center bg-gray-50 p-6">
      <section className="w-full max-w-2xl space-y-8">
        <Heading as="h1" size="xl" weight="bold" align="center" id="baseinfo">
          基本情報の入力
        </Heading>

        <div>
          {/* 名前（1行入力） */}
          <div className="space-y-2 flex justify-between">
            <Text as="label" size="sm" weight="semibold" tone="secondary">
              名前
            </Text>
            <OneLineInputField placeholder="山田 太郎" setText={setName} />
          </div>

          {/* 誕生日（カレンダーUI） */}
          <div className="space-y-2 flex justify-between">
            <Text as="label" size="sm" weight="semibold" tone="secondary">
              誕生日
            </Text>
            <BirthdateDatePicker
              value={birthdate}
              onChange={setBirthdate}
              minYear={1900}
              maxYear={new Date().getFullYear()}
              className="w-48"
            />
          </div>

          {/* 年齢（1行入力） */}
          <div className="space-y-2 flex justify-between">
            <Text as="label" size="sm" weight="semibold" tone="secondary">
              年齢
            </Text>
            <OneLineInputField placeholder="20" setText={setAge} />
          </div>

          {/* 出身（1行入力） */}
          <div className="space-y-2 flex justify-between">
            <Text as="label" size="sm" weight="semibold" tone="secondary">
              出身
            </Text>
            <OneLineInputField placeholder="東京都千代田区" setText={setOrigin} />
          </div>

          {/* 所属（1行入力） */}
          <div className="space-y-2 flex justify-between">
            <Text as="label" size="sm" weight="semibold" tone="secondary">
              所属
            </Text>
            <OneLineInputField placeholder="◯◯大学/◯◯株式会社" setText={setAffiliation} />
          </div>

          {/* 意気込み（複数行） */}
          <div className="space-y-2">
            <label htmlFor="motivation" className="block text-sm font-semibold text-gray-700">
              意気込み
            </label>
            <textarea
              id="motivation"
              className="block w-full  bg-[#aaa] 
               border border-gray-300 rounded-xl p-3 min-h-28
               focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 outline-none transition"
              placeholder="めちゃくちゃ頑張る"
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
            />
          </div>
        </div>

        {/* プレビュー */}
        <div className="rounded-xl border bg-white p-4 space-y-2">
          <Text size="sm" tone="muted">プレビュー</Text>
          <Text size="md"><span className="font-semibold">名前：</span>{name || ""}</Text>
          <Text size="md"><span className="font-semibold">誕生日：</span>{formatBirthdate(birthdate) || ""}</Text>
          <Text size="md"><span className="font-semibold">年齢：</span>{age || ""}</Text>
          <Text size="md"><span className="font-semibold">出身：</span>{origin || ""}</Text>
          <Text size="md"><span className="font-semibold">所属：</span>{affiliation || ""}</Text>
          <Text size="md"><span className="font-semibold">意気込み：</span>{motivation || ""}</Text>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center justify-center rounded-full px-5 py-3 font-semibold
             bg-[#ccc] text-gray-900 hover:bg-gray-600 active:translate-y-px transition"
          >
            完了
          </button>
        </div>
      </section>
    </main>
  );
}
