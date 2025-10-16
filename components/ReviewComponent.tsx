'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, Send } from 'lucide-react';

interface ReviewComponentProps {
  orderId: number;
  currentReview?: string | null;
  currentStars?: string | null;
}

export function ReviewComponent({ orderId, currentReview, currentStars }: ReviewComponentProps) {
  const [review, setReview] = useState(currentReview || '');
  const [stars, setStars] = useState(currentStars || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/update-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          review,
          stars: stars ? parseInt(stars) : null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage('Review updated successfully!');
        // Optionally reload the page to show updated data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setMessage('Error: ' + (result.error || 'Failed to update review'));
      }
    } catch (error) {
      setMessage('Network error: Please try again');
      console.error('Review update error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="col-span-2 border-t pt-4 mt-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor={`review-${orderId}`} className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Your Review
          </Label>
          <Textarea
            id={`review-${orderId}`}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience with this order..."
            rows={3}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor={`stars-${orderId}`} className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Rating (1-5 stars)
          </Label>
          <Input
            id={`stars-${orderId}`}
            type="number"
            min="1"
            max="5"
            value={stars}
            onChange={(e) => setStars(e.target.value)}
            placeholder="Rate from 1 to 5"
            className="mt-1 w-32"
          />
        </div>

        <div className="flex items-center gap-4">
          <Button
            type="submit"
            disabled={isSubmitting || !review.trim()}
            size="sm"
          >
            {isSubmitting ? 'Updating...' : currentReview ? 'Update Review' : 'Submit Review'}
          </Button>

          {message && (
            <div className={`text-sm ${
              message.includes('successfully') 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {message}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}