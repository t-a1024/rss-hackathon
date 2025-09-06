// src/pages/Home.tsx
import React, { useState } from "react";
import Heading from "../components/Heading/Heading";
import { IntegerStepperField } from "../components/IntegerInputField/IntegerInputField";
import Button from "../components/Button/Button";
import { toast } from "react-toastify";
import { Copy } from "lucide-react";

// プロキシを使うなら "/api"、CORSなら import.meta.env から
const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "/api";

export default function Home() {
  const [count, setCount] = useState<number | null>(1);
  const [loading, setLoading] = useState(false);

  // 部屋作成 → URL をトーストで表示
  const handleNext = async () => {
    if (count == null) {
      toast.warn("人数を入力してください");
      return;
    }
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participants: count }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: { id: string; room: any } = await res.json();

      // 表示用のルームURL（例: 自分のフロントの /rooms/:id に遷移させる想定）
      const roomUrl = `${window.location.origin}/rooms/${data.id}`;

      toast.info(
        <div className="flex flex-col gap-2">
          <span>完了しました！ 以下のURLをコピーできます:</span>
          <div className="flex items-center gap-2">
            <code className="px-2 py-1 bg-gray-100 rounded text-sm break-all">
              {roomUrl}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(roomUrl);
                toast.success("URLをコピーしました！");
              }}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              aria-label="URLをコピー"
            >
              <Copy size={16} />
              コピー
            </button>
          </div>
        </div>
      );
    } catch (e) {
      console.error(e);
      toast.error("部屋の作成に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 animate-slide-up-fade">
      <Heading as="h1" size="display" align="center" weight="bold" gradient id="welcome">
        なにものへようこそ
      </Heading>

      <section className="space-y-6 mt-3">
        <Heading as="h2" size="xl" align="center" weight="bold" id="participants">
          参加人数を入力
        </Heading>

        <div className="flex items-center justify-center gap-3">
          <IntegerStepperField
            id="participantsCount"
            name="participantsCount"
            value={count}
            onChange={setCount}
            min={1}
            max={99}
            step={1}
            size="md"
            placeholder="1"
          />
        </div>

        <p className="text-sm text-gray-500 text-center">
          現在の人数: <span className="font-medium">{count ?? "未入力"}</span>
        </p>

        <div className="flex justify-center">
          <Button text={loading ? "作成中..." : "完了"} onClickFunc={handleNext} />
        </div>
      </section>
    </main>
  );
}
