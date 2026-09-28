import { StarRating } from "@/components/ui/StarRating";
import { Card, CardBody } from "@/components/ui/Card";
import { formatDate } from "@/lib/format";
import { serviceLabel } from "@/lib/types";
import type { Review } from "@/lib/types";
import { BUSINESS } from "@/lib/site";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <Card>
      <CardBody>
        <article aria-label={`Review by ${review.name}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-cream-50">{review.name}</p>
              <p className="mt-0.5 text-xs text-ink-400">
                {formatDate(review.createdAt)}
                {review.serviceType && <> · {serviceLabel(review.serviceType)}</>}
              </p>
            </div>
            <StarRating value={review.rating} size="sm" label={`${review.rating} out of 5 stars`} />
          </div>
          <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-ink-200">{review.comment}</p>
          {review.ownerReply && (
            <div className="mt-4 rounded-xl border border-gold-500/20 bg-gold-500/5 p-3.5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">Reply from {BUSINESS.ownerFirstName}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-200">{review.ownerReply}</p>
            </div>
          )}
        </article>
      </CardBody>
    </Card>
  );
}
