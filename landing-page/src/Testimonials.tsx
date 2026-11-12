export type Testimonial = {
  name: string;
  company: string;
  quote: string;
  title?: string;
  portrait?: string;
  sourceUrl: string;
  permissionConfirmed: boolean;
};

// Add only attributable client statements cleared for publication.
export const TESTIMONIALS: Testimonial[] = [];

export default function Testimonials() {
  const reviews = TESTIMONIALS.filter(review => review.permissionConfirmed && review.quote.trim() && review.name.trim() && review.sourceUrl);
  if (!reviews.length) return null;
  return <section className="section client-feedback" aria-labelledby="feedback-title"><div className="wrap"><h2 id="feedback-title">What clients say</h2><div className="feedback-grid">{reviews.map(review => <figure className="feedback-card" key={review.sourceUrl + review.name}>
    {review.title && <h3>{review.title}</h3>}
    <blockquote><p>{review.quote}</p></blockquote>
    <figcaption>{review.portrait && <img src={review.portrait} alt="" width="46" height="46" loading="lazy"/>}<div><strong>{review.name}</strong><span>{review.company}</span></div><a href={review.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`Read the source for ${review.name}’s testimonial`}>Source ↗</a></figcaption>
  </figure>)}</div></div></section>;
}
