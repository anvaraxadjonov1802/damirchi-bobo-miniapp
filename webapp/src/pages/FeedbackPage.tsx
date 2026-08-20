import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Heart,
  Lightbulb,
  MessageSquareText,
  Send,
  Star,
  TriangleAlert,
} from "lucide-react";

import { submitFeedback } from "../api/feedback";

type FeedbackType = "compliment" | "suggestion" | "complaint";

const feedbackTypes: Array<{
  value: FeedbackType;
  label: string;
  description: string;
  icon: typeof Heart;
}> = [
  {
    value: "compliment",
    label: "Minnatdorchilik",
    description: "Sizga yoqqan jihatlarni yozing",
    icon: Heart,
  },
  {
    value: "suggestion",
    label: "Taklif",
    description: "Nimani yaxshilashimiz mumkin?",
    icon: Lightbulb,
  },
  {
    value: "complaint",
    label: "Shikoyat",
    description: "Muammoni bizga ayting",
    icon: TriangleAlert,
  },
];

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [feedbackType, setFeedbackType] = useState<FeedbackType | "">("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(
    () => rating > 0 && Boolean(feedbackType) && message.trim().length >= 3 && !loading,
    [rating, feedbackType, message, loading]
  );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError("");

    try {
      await submitFeedback({
        rating,
        feedback_type: feedbackType,
        message: message.trim(),
        name: name.trim(),
        phone: phone.trim(),
      });
      setSuccess(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Fikrni yuborishda xatolik yuz berdi."
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-[#f7f1e8] px-4 py-8 text-[#2c2119]">
        <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center">
          <section className="w-full rounded-[28px] border border-[#ddcfbd] bg-white p-7 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f1e3ca] text-[#7b4f25]">
              <CheckCircle2 size={34} strokeWidth={1.8} />
            </div>
            <h1 className="text-2xl font-semibold">Rahmat!</h1>
            <p className="mt-3 text-base leading-7 text-[#6c5a4b]">
              Fikringiz qabul qilindi. Sizning taklif va mulohazalaringiz Damirchi xizmatini yaxshilashimizga yordam beradi.
            </p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f1e8] px-4 py-6 text-[#2c2119] sm:py-10">
      <div className="mx-auto max-w-md">
        <header className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#2c2119] text-[#f3d5a2]">
            <MessageSquareText size={27} strokeWidth={1.8} />
          </div>
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#916a43]">
            Damirchi
          </p>
          <h1 className="mt-2 text-2xl font-semibold">Sizning fikringiz biz uchun muhim</h1>
          <p className="mt-2 text-sm leading-6 text-[#6c5a4b]">
            Xizmatimiz haqida taklif, minnatdorchilik yoki e’tirozingizni yozib qoldiring.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-[28px] border border-[#ddcfbd] bg-white p-5 shadow-sm sm:p-6"
        >
          <section>
            <label className="mb-3 block text-sm font-medium">Xizmatni baholang</label>
            <div className="flex justify-between gap-2" aria-label="Xizmat bahosi">
              {[1, 2, 3, 4, 5].map((value) => {
                const active = value <= rating;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-label={`${value} yulduz`}
                    onClick={() => setRating(value)}
                    className={`flex h-12 flex-1 items-center justify-center rounded-2xl border transition ${
                      active
                        ? "border-[#b8864b] bg-[#fff3dc] text-[#b2742f]"
                        : "border-[#e8ded0] bg-[#fbf8f3] text-[#b7a797]"
                    }`}
                  >
                    <Star size={23} fill={active ? "currentColor" : "none"} />
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <span className="mb-3 block text-sm font-medium">Murojaat turi</span>
            <div className="space-y-2.5">
              {feedbackTypes.map((item) => {
                const Icon = item.icon;
                const selected = feedbackType === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setFeedbackType(item.value)}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition ${
                      selected
                        ? "border-[#9b6b36] bg-[#fff7e9]"
                        : "border-[#e8ded0] bg-[#fbf8f3]"
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        selected
                          ? "bg-[#2c2119] text-[#f3d5a2]"
                          : "bg-white text-[#806b58]"
                      }`}
                    >
                      <Icon size={20} strokeWidth={1.9} />
                    </span>
                    <span>
                      <span className="block text-sm font-medium">{item.label}</span>
                      <span className="mt-0.5 block text-xs text-[#7d6b5d]">
                        {item.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <label htmlFor="feedback-message" className="mb-2 block text-sm font-medium">
              Fikringiz
            </label>
            <textarea
              id="feedback-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={2000}
              rows={5}
              placeholder="Fikringizni shu yerga yozing..."
              className="w-full resize-none rounded-2xl border border-[#ded3c5] bg-[#fbf8f3] px-4 py-3 text-base outline-none transition placeholder:text-[#aa9b8c] focus:border-[#9b6b36] focus:ring-2 focus:ring-[#9b6b36]/15"
            />
            <div className="mt-1 text-right text-xs text-[#9a8b7d]">{message.length}/2000</div>
          </section>

          <section className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="feedback-name" className="mb-2 block text-sm font-medium">
                Ismingiz <span className="font-normal text-[#9a8b7d]">(ixtiyoriy)</span>
              </label>
              <input
                id="feedback-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={120}
                placeholder="Ism"
                className="w-full rounded-2xl border border-[#ded3c5] bg-[#fbf8f3] px-4 py-3 text-base outline-none transition placeholder:text-[#aa9b8c] focus:border-[#9b6b36] focus:ring-2 focus:ring-[#9b6b36]/15"
              />
            </div>
            <div>
              <label htmlFor="feedback-phone" className="mb-2 block text-sm font-medium">
                Telefon <span className="font-normal text-[#9a8b7d]">(ixtiyoriy)</span>
              </label>
              <input
                id="feedback-phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                maxLength={30}
                inputMode="tel"
                placeholder="+998 ..."
                className="w-full rounded-2xl border border-[#ded3c5] bg-[#fbf8f3] px-4 py-3 text-base outline-none transition placeholder:text-[#aa9b8c] focus:border-[#9b6b36] focus:ring-2 focus:ring-[#9b6b36]/15"
              />
            </div>
          </section>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={!canSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2c2119] px-4 py-3.5 text-base font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={19} />
            {loading ? "Yuborilmoqda..." : "Fikrni yuborish"}
          </button>

          <p className="text-center text-xs leading-5 text-[#9a8b7d]">
            Yuborilgan murojaat Damirchi mas’ullariga yetkaziladi.
          </p>
        </form>
      </div>
    </main>
  );
}
