import type { KeyboardEvent } from 'react';

/**
 * Arrow-key movement for a `role="tablist"`, per the WAI-ARIA tabs pattern.
 * Only the selected tab is in the Tab order (`tabIndex` 0, the rest -1), so
 * the arrows are how a keyboard user reaches the others. Put it on the
 * tablist's `onKeyDown`.
 */
export function navigateTabs(
  event: KeyboardEvent<HTMLElement>,
  selected: number,
  select: (index: number) => void,
) {
  const tabs = event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]');
  let next = selected;
  if (event.key === 'ArrowRight') next = (selected + 1) % tabs.length;
  else if (event.key === 'ArrowLeft') next = (selected - 1 + tabs.length) % tabs.length;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = tabs.length - 1;
  else return;
  event.preventDefault();
  select(next);
  tabs[next]?.focus();
}
