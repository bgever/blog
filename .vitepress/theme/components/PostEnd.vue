<template>
  <!--
    The mark that closes a post. One continuous stroke with a small knot just
    past centre, fading out at both ends so it dissolves into the page rather
    than stopping dead. Inline SVG on currentColor: it themes with the rest of
    the site and costs no extra request.
  -->
  <div class="mt-12 mb-24 flex justify-center text-[var(--c-accent)]" role="presentation">
    <svg
      viewBox="0 0 200 26"
      fill="none"
      aria-hidden="true"
      class="block h-auto w-[190px] overflow-visible"
    >
      <defs>
        <linearGradient
          id="post-end-fade"
          x1="0"
          y1="0"
          x2="200"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stop-color="currentColor" stop-opacity="0" />
          <stop offset="0.2" stop-color="currentColor" stop-opacity="1" />
          <stop offset="0.8" stop-color="currentColor" stop-opacity="1" />
          <stop offset="1" stop-color="currentColor" stop-opacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M8 14 C46 14 70 14.6 86 13.4 C94 12.8 99 8 94 7.2 C89 6.4 88 12 94 14.4 C100 16.8 108 15 116 14 C140 11.6 166 14 192 14"
        stroke="url(#post-end-fade)"
        stroke-width="1.8"
        stroke-linecap="round"
      />
    </svg>
  </div>
</template>
