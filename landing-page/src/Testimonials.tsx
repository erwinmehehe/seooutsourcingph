// Client statements supplied by the site owner in this project.
// Preserve the wording; do not add results, ratings, portraits or verification badges.
const TESTIMONIALS = [
  {
    name: "Alex",
    company: "Paints Lab",
    quote: "Erwin is a great person and knowledgeable about what he is doing. We have managed to grow our organic positions for 9 months of cooperation.",
  },
  {
    name: "Pacific Seed Bank",
    company: "",
    quote: "Extremely helpful with very thorough explanations on the current caveats and shortcomings of our SEO strategy. And was able to deploy immediate fixes that helped our rankings and set us on a path for longer term growth",
  },
];

export default function Testimonials() {
  return <section className="section client-feedback" aria-labelledby="feedback-title"><div className="wrap"><h2 id="feedback-title">Client feedback</h2><div className="feedback-grid feedback-pair">{TESTIMONIALS.map(review => <figure className="feedback-card" key={review.name}>
    <blockquote><p>{review.quote}</p></blockquote>
    <figcaption><div><strong>{review.name}</strong>{review.company && <span>{review.company}</span>}</div></figcaption>
  </figure>)}</div></div></section>;
}
