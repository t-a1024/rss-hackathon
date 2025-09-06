import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

type ResultsButtonProps = {
  roomId?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
};

export default function ResultsButton({
  roomId,
  label = "結果を見る",
  className,
  disabled,
}: ResultsButtonProps) {
  const navigate = useNavigate();
  const params = useParams();
  const effectiveRoomId =
    roomId ?? (params as any).roomId ?? (params as any).id;

  const onClick = () => {
    if (!effectiveRoomId) {
      toast.warn("roomId が見つかりません。URL または引数を確認してください。");
      return;
    }
    navigate(`/rooms/${effectiveRoomId}/results`);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={
        className ??
        "inline-flex items-center justify-center rounded-full px-5 py-3 font-semibold " +
          "bg-[#ccc] text-gray-900 hover:bg-gray-600 hover:text-white active:translate-y-px " +
          "transition disabled:opacity-50 disabled:cursor-not-allowed"
      }
      aria-label={label}
    >
      {label}
    </button>
  );
}
