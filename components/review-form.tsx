"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type Props = {
  orderId: number;
  initialReview?: string | null;
  initialStars?: string | null;
};

export default function ReviewForm({ orderId, initialReview, initialStars }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [review, setReview] = useState(initialReview ?? '');
  const [stars, setStars] = useState<string>((initialStars ?? '').toString());
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    try {
      const payload = { orderId, review: review.trim(), stars: stars || null };
      const res = await fetch('/api/update-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save review');
      setMsg('Saved');
      startTransition(() => router.refresh());
    } catch (e: any) {
      setErr(e.message || 'Something went wrong');
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <Label htmlFor={`review-${orderId}`}>Your review</Label>
        <Textarea
          id={`review-${orderId}`}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share your experience…"
          rows={3}
        />
      </div>
      <div>
        <Label>Rating</Label>
        <RadioGroup
          className="flex gap-4 mt-1"
          value={stars}
          onValueChange={setStars}
        >
          {[1, 2, 3, 4, 5].map((v) => (
            <div key={v} className="flex items-center space-x-2">
              <RadioGroupItem id={`star-${orderId}-${v}`} value={String(v)} />
              <Label htmlFor={`star-${orderId}-${v}`}>{v}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : 'Save review'}
        </Button>
        {msg && <span className="text-green-600 text-sm">{msg}</span>}
        {err && <span className="text-red-600 text-sm">{err}</span>}
      </div>
    </form>
  );
}
