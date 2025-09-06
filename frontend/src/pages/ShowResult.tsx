// src/pages/ShowResult.tsx
import { useState, useMemo, useEffect, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Heading from "../components/Heading/Heading";
import type { CompletedPayload, ProcessingPayload } from "../types/result";
import Result from "../components/Result/Result"; 

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "/api";
const NO_IMAGE = "/noimage.png";

const toResultProps = (p: any) => {
  const title =
    p.roleTitle && p.roleTitleEnglish
      ? `${p.roleTitle} / ${p.roleTitleEnglish}`
      : p.roleTitle || p.roleTitleEnglish || "役職未設定";

  return {
    name: p.name ?? "名前不明",
    role: {
      title,
      imageUrl: p.imageUrl ?? NO_IMAGE,
      birthday: p.birthdate ?? "—",
      age: p.age ?? "—",
      enthusiasm: p.aspiration ?? "—",
      birthplace: p.hometown ?? "—",
      affiliation: p.affiliation ?? "—",
      description: p.reason ?? "",
      suitability: p.tips ?? "",
    },
  };
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

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setIdx(0);
  }, [completed?.results?.length]);

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
        try {
          err = JSON.parse(raw);
        } catch {
          err = { message: raw };
        }
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

  const goPrev = useCallback(() => {
    if (!completed) return;
    const n = completed.results.length;
    if (n <= 1) return;
    setIdx((i) => (i - 1 + n) % n);
  }, [completed]);

  const goNext = useCallback(() => {
    if (!completed) return;
    const n = completed.results.length;
    if (n <= 1) return;
    setIdx((i) => (i + 1) % n);
  }, [completed]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!completed || completed.results.length <= 1) return;
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [completed, goPrev, goNext]);

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

        {/* ===== Result で表示（左右で切替） ===== */}
        {completed && completed.results.length > 0 && (
          <>
            {/* メタ情報 */}
            <div className="rounded-lg border bg-white p-4">
              <p className="text-sm text-gray-600">
                生成日時:{" "}
                <span className="font-medium">
                  {new Date(completed.generatedAt).toLocaleString()}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                参加人数: <span className="font-medium">{completed.participants}</span>
              </p>
              {completed.results.length > 1 && (
                <p className="mt-1 text-xs text-gray-500">
                  {idx + 1} / {completed.results.length}
                </p>
              )}
            </div>

            {/* 現在の人を表示 */}
            <Result
              {...toResultProps(completed.results[idx])}
              onPrev={completed.results.length > 1 ? goPrev : undefined}
              onNext={completed.results.length > 1 ? goNext : undefined}
              showArrows={completed.results.length > 1}
            />
          </>
        )}

        {processing && (
          <div className="rounded-xl border bg-white p-4 text-center">
            <p className="text-base font-semibold text-gray-800">
              {processing.message || "しばらくお待ちください。"}
            </p>
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
