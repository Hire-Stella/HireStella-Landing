import { ButtonLink, Eyebrow } from '@/components/ui';
export default function NotFound() {
  return (
    <main id="main" className="not-found container">
      <Eyebrow>404 / A CONNECTION NOT FOUND</Eyebrow>
      <h1>
        Let’s get you
        <br />
        <span className="muted">back on track.</span>
      </h1>
      <p>This page isn’t part of the workforce. Your next step is.</p>
      <ButtonLink href="/">Back to HireStella</ButtonLink>
    </main>
  );
}
