(() => {
  const root = document.querySelector(".brand-intro");
  const button = root?.querySelector(".motion-button");
  const poster = root?.querySelector(".motion-poster");
  const canvas = button?.querySelector("canvas");
  if (!button || !poster || !canvas || typeof Path2D === "undefined") return;
  const context = canvas.getContext("2d");
  if (!context) return;

  // The Soft Steps contours, keyframes, and interpolation are from HER's launch animation.
  const paths = [
    `M 592.733 320.465        C 572.832 321.491 553.034 325.728 534.424 332.849        C 517.673 339.258 501.756 347.472 486.607 357.055        C 472.282 366.117 458.662 376.264 445.618 387.075        C 432.574 397.887 420.032 409.569 408.107 421.605        C 396.312 433.511 384.928 445.862 374.119 458.664        C 363.093 471.723 352.668 485.331 342.608 499.141        C 332.427 513.118 323.069 527.738 313.975 542.441        C 304.837 557.214 296.288 572.449 288.485 587.966        C 280.372 604.097 272.578 620.276 265.419 636.864        C 258.189 653.618 251.499 670.599 245.356 687.781        C 238.847 705.987 233.3 724.515 228.692 743.289        C 223.624 763.936 220.565 785.198 220.852 806.5        C 221.132 827.212 224.726 847.611 232.672 866.795        C 239.354 882.929 249.436 897.384 262.445 909.052        C 275.593 920.844 291.43 929.059 308.195 934.397        C 327.52 940.552 347.494 944.353 367.639 946.603        C 390.192 949.123 412.815 950.058 435.5 950.167        C 459.168 950.281 482.85 950.245 506.5 949.257        C 528.264 948.347 550.025 946.86 571.515 943.173        C 590.285 939.952 609.527 935.135 626.25 925.736        C 641.827 916.981 654.033 904.042 659.404 886.811        C 665.605 866.916 662.483 845.709 656.426 826.149        C 650.878 808.236 643.25 791.088 637.224 773.344        C 630.818 754.48 625.337 735.475 623.937 715.5        C 622.471 694.583 625.162 673.354 631.995 653.502        C 637.81 636.61 645.59 620.592 654.861 605.342        C 663.858 590.542 673.872 576.462 683.841 562.312        C 693.863 548.089 703.522 533.453 711.463 517.947        C 719.907 501.456 726.766 483.821 729.844 465.491        C 733.366 444.511 732.168 422.613 725.12 402.461        C 719.402 386.116 710.031 370.937 698.037 358.462        C 685.984 345.927 670.864 336.103 654.707 329.742        C 635.071 322.012 613.722 319.383 592.733 320.465        Z`,
    `M 760.664 546.422        C 741.825 547.976 724.281 554.572 708.739 565.248        C 694.699 574.891 682.879 587.881 673.594 602.101        C 663.802 617.098 656.382 633.773 651.503 650.991        C 645.573 671.915 643.684 693.869 646.103 715.5        C 648.318 735.298 652.856 754.779 658.605 773.84        C 664.035 791.848 670.204 809.806 677.355 827.209        C 684.079 843.571 691.069 860.106 700.211 875.298        C 708.997 889.897 719.591 903.799 732.895 914.581        C 746.76 925.818 763.085 933.534 780.219 938.372        C 800.723 944.161 822.251 946.322 843.5 946.626        C 865.785 946.944 888.169 945.5 910.116 941.542        C 928.528 938.221 947.159 932.744 964.005 924.511        C 979.424 916.974 994.147 906.996 1005.144 893.689        C 1016.591 879.837 1023.938 862.767 1027.619 845.246        C 1032.072 824.048 1031.268 801.659 1026.77 780.553        C 1022.898 762.383 1016.584 744.695 1008.52 727.964        C 1000.885 712.123 991.847 697.123 981.801 682.705        C 972.214 668.948 961.439 655.768 949.864 643.635        C 938.109 631.313 925.863 619.611 912.805 608.67        C 899.822 597.792 886.088 587.715 871.614 578.911        C 856.311 569.604 840.25 561.082 823.252 555.306        C 803.082 548.452 782.02 544.659 760.664 546.422        Z`
  ].map((shape) => new Path2D(shape));

  const pivots = [[503, 893], [793, 895]];

  // Time (ms), X and Y offset, angle (degrees), horizontal and vertical scale.
  const steps = [
    [
      [0,-268,0,-13.5,1,1], [155,-268,0,-14,1,1],
      [250,-264,0,-9.5,1.02,.98], [390,-230,-26,-7,.978,1.025],
      [535,-180,0,-9,1.039,.968], [650,-177,0,-10,1,1],
      [770,-173,0,-7.8,1.017,.984], [910,-139,-25,-5.6,.979,1.022],
      [1060,-101,0,-6.7,1.035,.971], [1180,-98,0,-7,1,1],
      [1300,-94,0,-5.5,1.014,.986], [1430,-71,-18,-3.6,.984,1.018],
      [1580,-53,0,-4,1.025,.981], [1700,-51,0,-4,1,1],
      [1900,-49,0,-1.25,1.005,.998], [2060,-44,0,-.85,1,1],
      [2390,-15,0,-.25,1.01,.994], [2760,0,0,0,1,1]
    ],
    [
      [0,274,0,12,1,1], [295,274,0,12.4,1,1],
      [390,269,0,9,1.02,.98], [530,228,-22,6.7,.98,1.022],
      [680,185,0,8.5,1.037,.968], [795,181,0,9,1,1],
      [915,177,0,7,1.016,.984], [1065,143,-23,5.4,.981,1.02],
      [1205,111,0,6.6,1.033,.973], [1325,108,0,7,1,1],
      [1445,104,0,5.6,1.014,.986], [1580,81,-17,4.25,.983,1.017],
      [1735,64,0,5,1.025,.982], [1850,62,0,5,1,1],
      [2060,57,0,2.9,1,1], [2225,40,-6,1.6,.997,1.008],
      [2460,13,0,.52,1.009,.995], [2790,0,0,0,1,1]
    ]
  ];

  const duration = 3000;
  const preferences = matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0;
  let position = duration;
  let playing = false;
  let previousTick = null;
  let inView = false;
  let autoPlayPending = true;

  function slope(keys, index, column) {
    if (index === 0 || index === keys.length - 1) return 0;
    const before = keys[index - 1], current = keys[index], after = keys[index + 1];
    const to = (current[column] - before[column]) / (current[0] - before[0]);
    const from = (after[column] - current[column]) / (after[0] - current[0]);
    return to * from > 0 ? 2 * to * from / (to + from) : 0;
  }

  function poseAt(keys, ms) {
    const end = keys.findIndex(k => k[0] > ms);
    if (end < 0) return keys[keys.length - 1].slice(1);
    const first = keys[end - 1], next = keys[end];
    const span = next[0] - first[0];
    const u = (ms - first[0]) / span;
    const u2 = u * u, u3 = u2 * u;
    return first.slice(1).map((value, index) => {
      const column = index + 1;
      return (2 * u3 - 3 * u2 + 1) * value + (-2 * u3 + 3 * u2) * next[column]
        + (u3 - 2 * u2 + u) * span * slope(keys, end - 1, column)
        + (u3 - u2) * span * slope(keys, end, column);
    });
  }

  function render(position) {
    const { width, height } = canvas;
    // Tighter landing viewport; original contours and all three-second keyframes stay intact.
    const scale = Math.min(width / 1440, height / 780);
    context.resetTransform();
    context.clearRect(0, 0, width, height);
    context.setTransform(scale, 0, 0, scale, width / 2 - 627 * scale, height / 2 - 635 * scale);
    context.fillStyle = "#f6e5cf";

    paths.forEach((path, index) => {
      const [x, y, angle, scaleX, scaleY] = poseAt(steps[index], position);
      const [pivotX, pivotY] = pivots[index];
      context.save();
      context.translate(pivotX + x, pivotY + y);
      context.rotate(angle * Math.PI / 180);
      context.scale(scaleX, scaleY);
      context.translate(-pivotX, -pivotY);
      context.fill(path);
      context.restore();
    });
  }

  function cancelTick() {
    cancelAnimationFrame(frame);
    frame = 0;
    previousTick = null;
  }

  function settle() {
    cancelTick();
    playing = false;
    position = duration;
    root.dataset.motionState = "settled";
    render(position);
  }

  function tick(now) {
    frame = 0;
    if (!playing || preferences.matches || document.hidden) return;
    if (previousTick !== null) position = Math.min(duration, position + now - previousTick);
    previousTick = now;
    render(position);
    if (position >= duration) settle();
    else frame = requestAnimationFrame(tick);
  }

  function play() {
    if (preferences.matches) return;
    autoPlayPending = false;
    cancelTick();
    playing = true;
    position = 0;
    root.dataset.motionState = "playing";
    render(position);
    if (!document.hidden) frame = requestAnimationFrame(tick);
  }

  function resize() {
    const box = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 3);
    const width = Math.max(1, Math.round(box.width * ratio));
    const height = Math.max(1, Math.round(box.height * ratio));
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
    render(position);
  }

  function syncPreferences() {
    cancelTick();
    playing = false;
    button.hidden = preferences.matches;
    poster.hidden = !preferences.matches;
    if (preferences.matches) {
      position = duration;
      root.dataset.motionState = "poster";
    } else {
      resize();
      if (autoPlayPending && inView && !document.hidden) play();
      else settle();
    }
  }

  button.addEventListener("click", play);
  preferences.addEventListener("change", syncPreferences);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelTick();
    else if (autoPlayPending && inView && !preferences.matches) play();
    else if (playing && !frame && inView && !preferences.matches) frame = requestAnimationFrame(tick);
  });
  window.addEventListener("pagehide", cancelTick);
  window.addEventListener("pageshow", () => {
    if (playing && !frame && inView && !document.hidden && !preferences.matches) frame = requestAnimationFrame(tick);
  });

  if (typeof ResizeObserver !== "undefined") new ResizeObserver(resize).observe(button);
  else window.addEventListener("resize", resize, { passive: true });

  syncPreferences();
  if (typeof IntersectionObserver !== "undefined") {
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (autoPlayPending && inView && !preferences.matches && !document.hidden) play();
      else if (!inView && playing) settle();
    }, { threshold: 0 }).observe(root);
  } else {
    inView = true;
    if (!preferences.matches && !document.hidden) play();
  }
})();
