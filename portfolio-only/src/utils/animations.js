// Reusable GSAP animation utilities.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };

export function splitChars(el) {
  if (!el) return [];
  const text = el.textContent;
  el.innerHTML = '';
  return [...text].map((ch) => {
    const span = document.createElement('span');
    span.style.display = 'inline-block';
    span.style.willChange = 'transform, opacity';
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    el.appendChild(span);
    return span;
  });
}

export function revealText(el, opts = {}) {
  const chars = splitChars(el);
  return gsap.from(chars, {
    yPercent: 120,
    opacity: 0,
    ease: 'power4.out',
    duration: 0.9,
    stagger: 0.025,
    ...opts,
  });
}

export function fadeUpOnScroll(targets, opts = {}) {
  return gsap.from(targets, {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    stagger: 0.08,
    scrollTrigger: { trigger: targets, start: 'top 85%' },
    ...opts,
  });
}

export function pinSection(trigger, opts = {}) {
  return ScrollTrigger.create({ trigger, start: 'top top', end: '+=100%', pin: true, ...opts });
}
