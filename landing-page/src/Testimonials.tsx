export type Testimonial = {
  name: string;
  company: string;
  quote: string;
  title?: string;
  portrait?: string;
  sourceUrl?: string;
  permissionConfirmed: boolean;
};

// Add only attributable client statements cleared for publication.
export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Alex",
    company: "Paints Lab",
    quote: "Erwin is a great person and knowledgeable about what he is doing. We have managed to grow our organic positions over nine months of cooperation.",
    permissionConfirmed: true,
  },
  {
    name: "Pacific Seed Bank",
    company: "",
    quote: "Extremely helpful, with very thorough explanations of the current caveats and shortcomings of our SEO strategy. He was able to deploy immediate fixes that helped our rankings and set us on a path for longer-term growth.",
    permissionConfirmed: true,
  },
];

export default function Testimonials() {
  const reviews = TESTIMONIALS.filter(review => review.permissionConfirmed && review.quote.trim() && review.name.trim());
  if (!reviews.length) return null;
  return <section className="section client-feedback" aria-labelledby="feedback-title"><div className="wrap"><h2 id="feedback-title">What clients say</h2><div className={`feedback-grid${reviews.length === 2 ? " feedback-pair" : ""}`}>{reviews.map(review => <figure className="feedback-card" key={review.company + review.name}>
    {review.title && <h3>{review.title}</h3>}
    <blockquote><p>{review.quote}</p></blockquote>
    <figcaption>{review.portrait && <img src={review.portrait} alt="" width="46" height="46" loading="lazy"/>}<div><strong>{review.name}</strong>{review.company && <span>{review.company}</span>}</div>{review.sourceUrl && <a href={review.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`Read the source for ${review.name}’s testimonial`}>Source ↗</a>}</figcaption>
  </figure>)}</div></div></section>;
}
