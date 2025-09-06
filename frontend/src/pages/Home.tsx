// src/pages/Home.tsx
import { useState } from "react";
import Heading from "../components/Heading/Heading";
import { IntegerStepperField } from "../components/IntegerInputField/IntegerInputField";
import BG from "../Image/First.png";
import BackgroundImage from "../Image/card_background.jpg";
import { toast } from "react-toastify";
import { Copy } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "/api";

export default function Home() {
  const [count, setCount] = useState<number | null>(2);
  const [loading, setLoading] = useState(false);

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
        body: JSON.stringify({ capacity: count }),
      });

      if (!res.ok) {
        const raw = await res.text();
        let err: any;
        try { err = JSON.parse(raw); } catch { err = { message: raw }; }
        const msg = err?.message || err?.error || `HTTP ${res.status}`;
        toast.error(`部屋の作成に失敗しました: ${msg}`);
        return;
      }

      const data: { id: string; url?: string } = await res.json();

      const roomUrl = `${window.location.origin}/rooms/${data.id}`;

      toast.info(
        <div className="flex flex-col gap-2">
          <span>完了しました！ 以下のURLでルームを作成してください！</span>
          <div className="flex items-center gap-2">
            <code className="px-2 py-1 bg-gray-100 rounded text-sm break-all">{roomUrl}</code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(roomUrl);
                toast.success("URLをコピーしました！");
              }}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              aria-label="URLをコピー"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>
      );
    } catch (e) {
      console.error(e);
      toast.error("ネットワークエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-4 animate-slide-up-fade pop bg-cover bg-center"
      style={{ backgroundImage: `url(${BG})` }}
    >
      <div
        className="border-2 border-yellow-500 rounded-2xl shadow-md p-15 bg-cover bg-center"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
        <Heading
          as="h1"
          size="display"
          align="center"
          weight="bold"
          id="welcome"
          className="text-black text-xl md:text-5xl whitespace-nowrap"
        >
          <span className="text-orange-500">ナニモノ？</span>
          へようこそ
        </Heading>

        <section className="space-y-6 mt-3">
          <Heading
            as="h2"
            size="xl"
            align="center"
            weight="bold"
            id="participants"
            // モバイルではtext-xl、PC(md以上)ではtext-3xlに設定
            className="text-black text-xl md:text-3xl"
          >
            参加人数を入力
          </Heading>

          <div className="flex items-center justify-center gap-3">
            <IntegerStepperField
              id="participantsCount"
              name="participantsCount"
              value={count}
              onChange={setCount}
              min={2}
              max={10}
              step={1}
              size="md"
              placeholder="2"
            />
          </div>

          <p
            // モバイルではtext-base、PC(md以上)ではtext-lgに設定
            className="text-black text-center text-base md:text-lg"
          >
            現在の人数: <span className="font-medium">{count ?? "未入力"}</span>
          </p>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center justify-center rounded-full px-5 py-3 font-semibold
           bg-gray-200 text-gray-900 hover:text-orange-500 active:translate-y-px transition"
            >
              {loading ? "作成中..." : "完了"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
