import Link from 'next/link';
import { PageHero, Tri } from '@/components/system';

/**
 * Built on the shared page hero so it inherits the live styles and theme. The
 * previous version used `.not-found` and `ButtonLink`, styled only by
 * interior.css, which nothing imports: the message and its button rendered
 * invisibly between the header and the footer.
 */
export default function NotFound() {
  return (
    <main id="main">
      <PageHero
        eyebrow="404 · Page not found"
        title={
          <>
            Let’s get you
            <br />
            back on track.
          </>
        }
        lede="This page isn’t part of the site, or it has moved. Start from the homepage or see what Stella does."
        actions={
          <>
            <Link className="btn btn-1" href="/">
              Back to HireStella <Tri />
            </Link>
            <Link className="btn btn-2" href="/stella">
              Meet Stella
            </Link>
          </>
        }
      />
    </main>
  );
}
