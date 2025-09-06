// src/pages/BaseInfo.tsx
import React, { useMemo, useState } from "react";
import Text from "../components/Text/text";
import TextInputField from "../components/TextInputField/TextInputField";
import Heading from "../components/Heading/Heading";
import Button from "../components/Button/Button";
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

  const allFilled = useMemo(
    () => name && formatBirthdate(birthdate) && age && origin && affiliation && motivation,
    [name, birthdate, age, origin, affiliation, motivation]
  );

  const handleSubmit = () => {
    const payload = {
      name,
      birthday: formatBirthdate(birthdate),
      age,
      origin,
      affiliation,
      motivation,
    };
    console.log("submit:", payload);
    alert("送信しました！\n" + JSON.stringify(payload, null, 2));
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
            <OneLineInputField placeholder="◯◯大学 △△学部 / ◯◯株式会社" setText={setAffiliation} />
          </div>

          {/* 意気込み（複数行） */}
          <div className="space-y-2">
            <Text as="label" size="sm" weight="semibold" tone="secondary">
              意気込み
            </Text>
            <TextInputField
              rows={4}
              cols={60}
              placeholder="めちゃくちゃ頑張る"
              setText={setMotivation}
            />
          </div>
        </div>

        {/* プレビュー */}
        <div className="rounded-xl border bg-white p-4 space-y-2">
          <Text size="sm" tone="muted">プレビュー</Text>
          <Text size="md"><span className="font-semibold">名前：</span>{name || "—"}</Text>
          <Text size="md"><span className="font-semibold">誕生日：</span>{formatBirthdate(birthdate) || "—"}</Text>
          <Text size="md"><span className="font-semibold">年齢：</span>{age || "—"}</Text>
          <Text size="md"><span className="font-semibold">出身：</span>{origin || "—"}</Text>
          <Text size="md"><span className="font-semibold">所属：</span>{affiliation || "—"}</Text>
          <Text size="md"><span className="font-semibold">意気込み：</span>{motivation || "—"}</Text>
        </div>

        <div className="flex justify-center">
          <Button text="送信" onClickFunc={handleSubmit} />
        </div>
      </section>
    </main>
  );
}
