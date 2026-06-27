'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'

import { createReview } from '@/app/actions/reviews'

export function ReviewForm({ requestId, artisanName }: { requestId: string, artisanName: string }) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      setError('Please select a star rating')
      return
    }

    setIsSubmitting(true)
    setError(null)

    const result = await createReview(requestId, rating, comment)
    
    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
        <Star className="w-12 h-12 text-green-500 mx-auto mb-3 fill-green-500" />
        <h3 className="text-xl font-bold text-green-600 mb-2">Thank you!</h3>
        <p className="text-green-700/80">Your review for {artisanName} has been submitted successfully.</p>
      </div>
    )
  }

  return (
    <div className="p-6 bg-card border border-border/50 shadow-sm rounded-xl">
      <h3 className="text-xl font-semibold mb-2">Rate your experience</h3>
      <p className="text-sm text-muted-foreground mb-4">How was your service with {artisanName}?</p>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            >
              <Star 
                className={`w-9 h-9 transition-colors ${
                  star <= (hoverRating || rating) 
                    ? 'fill-amber-500 text-amber-500' 
                    : 'fill-muted text-muted-foreground/30'
                }`} 
              />
            </button>
          ))}
        </div>
        
        {error && <p className="text-sm text-destructive font-medium bg-destructive/10 p-3 rounded-md">{error}</p>}
        
        <div className="space-y-2">
          <label htmlFor="comment" className="text-sm font-medium text-foreground">Add a comment (optional)</label>
          <textarea 
            id="comment"
            placeholder="What did they do well? What could be improved?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none h-28"
          />
        </div>

        <Button type="submit" disabled={isSubmitting || rating === 0} className="w-full h-11 text-base rounded-full">
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>
    </div>
  )
}
