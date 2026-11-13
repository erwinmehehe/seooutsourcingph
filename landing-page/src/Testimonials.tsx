import { useEffect, useState } from "react";
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

const MOCKUP_REVIEWS = [
 ["Our service pages finally reached page one.", "We’d been stuck behind the same competitors for months. Several important searches moved onto page one, and more enquiries started coming through those pages."],
 ["More traffic from people ready to buy.", "Organic traffic increased, but the bigger difference was the quality. More visitors were finding our product pages and placing orders."],
 ["Organic search became a stronger sales channel.", "We started seeing more sales from customers who found us through Google. It gave us another source of revenue alongside paid advertising."],
 ["More local searches turned into calls.", "Our visibility improved across the areas we serve. We began getting more calls from people asking about specific services, rather than general questions."],
 ["Older content started bringing in customers.", "Several articles had stopped getting much attention. After the updates, they began attracting relevant traffic again and sending visitors to our service pages."],
 ["The reports connected SEO to the business.", "We could see which searches and pages were improving, then follow that through to enquiries and sales. That made it easier to decide where to invest next."],
];

export default function Testimonials() {
  const [mockup, setMockup] = useState(false);
  useEffect(() => {
    const previewHost = location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.hostname.endsWith('.github.io');
    setMockup(previewHost && new URLSearchParams(location.search).get('mockup') === '1');
  }, []);
  const reviews = TESTIMONIALS.filter(review => review.permissionConfirmed && review.quote.trim() && review.name.trim());
  if (!reviews.length) return null;
  return <><section className="section client-feedback" aria-labelledby="feedback-title"><div className="wrap"><h2 id="feedback-title">What clients say</h2><div className={`feedback-grid${reviews.length === 2 ? " feedback-pair" : ""}`}>{reviews.map(review => <figure className="feedback-card" key={review.company + review.name}>
    {review.title && <h3>{review.title}</h3>}
    <blockquote><p>{review.quote}</p></blockquote>
    <figcaption>{review.portrait && <img src={review.portrait} alt="" width="46" height="46" loading="lazy"/>}<div><strong>{review.name}</strong>{review.company && <span>{review.company}</span>}</div>{review.sourceUrl && <a href={review.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`Read the source for ${review.name}’s testimonial`}>Source ↗</a>}</figcaption>
  </figure>)}</div></div></section>
  {mockup && <section className="section client-feedback" aria-labelledby="mockup-feedback-title"><div className="wrap"><h2 id="mockup-feedback-title">Testimonial layout preview</h2><p className="mockup-disclosure">Fictional placeholder testimonials for design review. These are not client statements or verified results.</p><div className="feedback-grid">{MOCKUP_REVIEWS.map(([title, quote]) => <figure className="feedback-card" key={title}><h3>{title}</h3><blockquote><p>{quote}</p></blockquote><figcaption><span>Fictional sample · Mockup only</span></figcaption></figure>)}</div></div></section>}
  </>;
}
