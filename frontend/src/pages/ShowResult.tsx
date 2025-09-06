// src/pages/ShowResult.tsx
import { useState, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Heading from "../components/Heading/Heading";

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "/api";

// 型（任意だが補助的に）
type Participant = {
  name: string;
  birthdate: string;
  age: number;
  hometown: string;
  affiliation: string; // 所属
  aspiration: string;  // 意気込み
  roleId?: string;
  roleTitle?: string;
  roleTitleEnglish?: string;
  reason?: string;
  tips?: string;
};
type CompletedPayload = {
  roomId: string;
  status: "completed";
  generatedAt: string;
  participants: number;
  results: Participant[];
};
type ProcessingPayload = {
  roomId: string;
  status: "processing";
  message?: string;
  estimatedCompletionTime?: string;
};

export default function ShowResult() {
  const params = useParams();
  const location = useLocation();
  const roomId = useMemo(() => {
    const fromPath = (params as any).roomId ?? (params as any).id ?? "";
    if (fromPath) return fromPath;
    const q = new URLSearchParams(location.search);
    return q.get("roomId") ?? "";
  }, [params, location.search]);

  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState<CompletedPayload | null>(null);
  const [processing, setProcessing] = useState<ProcessingPayload | null>(null);

  const fetchResults = async () => {
    if (!roomId) {
      toast.warn("URL から roomId を取得できませんでした。");
      return;
    }
    setLoading(true);
    setCompleted(null);
    setProcessing(null);

    try {
      const res = await fetch(`${API_BASE}/rooms/${roomId}/results`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        if (res.status === 404) {
          toast.error("部屋が見つかりませんでした（404）。");
          return;
        }
        const raw = await res.text();
        let err: any;
        try { err = JSON.parse(raw); } catch { err = { message: raw }; }
        toast.error(`取得に失敗しました: ${err?.message || err?.error || `HTTP ${res.status}`}`);
        return;
      }

      const data: CompletedPayload | ProcessingPayload = await res.json();

      if (data.status === "completed") {
        setCompleted(data);
      } else if (data.status === "processing") {
        setProcessing(data);
        const eta = data.estimatedCompletionTime
          ? new Date(data.estimatedCompletionTime).toLocaleString()
          : "未定";
        toast.info(
          <div>
            <div className="font-medium">結果はまだ生成中です。</div>
            <div className="mt-1 text-sm text-gray-700">{data.message || "しばらくお待ちください。"}</div>
            <div className="mt-1 text-xs text-gray-500">推定完了時刻: {eta}</div>
          </div>
        );
      } else {
        toast.warn("不明なレスポンスを受け取りました。");
        console.warn("Unknown results payload:", data);
      }
    } catch (e) {
      console.error(e);
      toast.error("ネットワークエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <section className="w-full max-w-3xl space-y-8">
        <Heading as="h1" size="xl" weight="bold" align="center">
          結果を見る
        </Heading>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={fetchResults}
            className="inline-flex items-center justify-center rounded-full px-5 py-3 font-semibold
                       bg-[#ccc] text-gray-900 hover:bg-gray-600 hover:text-white active:translate-y-px transition
                       disabled:opacity-50 disabled:cursor-not-allowed gap-2"
            disabled={!roomId || loading}
          >
            {loading && (
              <span className="h-4 w-4 rounded-full border-2 border-gray-200 border-t-gray-700 animate-spin" />
            )}
            {completed || processing ? "再取得" : "結果を見る"}
          </button>
        </div>

        {/* === 結果レンダリング === */}
        {completed && (
          <div className="space-y-4">
            <div className="rounded-lg border bg-white p-4">
              <p className="text-sm text-gray-600">
                生成日時: <span className="font-medium">{new Date(completed.generatedAt).toLocaleString()}</span>
              </p>
              <p className="text-sm text-gray-600">
                参加人数: <span className="font-medium">{completed.participants}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {completed.results.map((p, idx) => (
                <div key={idx} className="rounded-xl border bg-white p-4 shadow-sm">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold">
                      {p.name}
                      {p.roleTitle && (
                        <span className="ml-2 text-base font-semibold text-gray-700">
                          （{p.roleTitle}{p.roleTitleEnglish ? ` / ${p.roleTitleEnglish}` : ""}）
                        </span>
                      )}
                    </h3>

                    <div className="text-sm text-gray-800 leading-6">
                      <div>誕生日：{p.birthdate || "—"}</div>
                      <div>年齢：{p.age ?? "—"}</div>
                      <div>出身：{p.hometown || "—"}</div>
                      <div>所属：{p.affiliation || "—"}</div>
                      <div className="mt-1">
                        意気込み：<span className="font-medium">{p.aspiration || "—"}</span>
                      </div>
                    </div>

                    {(p.reason || p.tips) && (
                      <div className="mt-3 rounded-lg border border-dashed p-3 text-sm text-gray-800">
                        {p.reason && (
                          <p className="mb-2">
                            <span className="font-semibold">評価理由：</span>
                            {p.reason}
                          </p>
                        )}
                        {p.tips && (
                          <p>
                            <span className="font-semibold">活躍のヒント：</span>
                            {p.tips}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {processing && (
          <div className="rounded-xl border bg-white p-4 text-center">
            <p className="text-base font-semibold text-gray-800">結果はまだ生成中です。</p>
            <p className="mt-1 text-sm text-gray-700">{processing.message || "しばらくお待ちください。"}</p>
            <p className="mt-1 text-xs text-gray-500">
              推定完了時刻：
              {processing.estimatedCompletionTime
                ? new Date(processing.estimatedCompletionTime).toLocaleString()
                : "未定"}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
