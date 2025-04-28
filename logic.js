//Logic for calculating the position of Dots and drawing Lines between them
const containers = document.querySelectorAll('.dot-container');

// --- Helper: Create a curved SVG path
function createCurve(svg, x1, y1, x2, y2, x3, y3) {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", `M ${x1},${y1} Q ${x2},${y2} ${x3},${y3}`);
  path.setAttribute("class", "curve");
  path.classList.add('curve-blurred');
  svg.appendChild(path);
}

// --- Helper: Create a straight line (div)
function createStraightLine(line, x1, y1, x3, y3) {
  const dx = x3 - x1;
  const dy = y3 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;

  line.style.left = `${x1}px`;
  line.style.top = `${y1}px`;
  line.style.width = `${length}px`;
  line.style.transform = `rotate(${angle}deg)`;
}

// --- Main update function
function updateLines() {
  containers.forEach(container => {
    const dots = Array.from(container.querySelectorAll('.dot'));
    const lines = container.querySelectorAll('.line');
    
    let svg = container.querySelector('.line-svg');

    if (!svg) {
      svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("class", "line-svg");
      svg.style.position = "absolute";
      svg.style.top = "0";
      svg.style.left = "0";
      svg.style.width = "100%";
      svg.style.height = "100%";
      svg.style.overflow = "visible";
      svg.style.pointerEvents = "none";
      container.appendChild(svg);
    } else {
      svg.innerHTML = '';
    }

    const containerRect = container.getBoundingClientRect();

    lines.forEach(line => {
      const fromIndex = +line.dataset.from;
      const toIndex = +line.dataset.to;
      const viaIndex = line.dataset.via !== undefined ? +line.dataset.via : null;

      const dotA = dots[fromIndex].getBoundingClientRect();
      const dotC = dots[toIndex].getBoundingClientRect();
      
      const x1 = dotA.left + dotA.width / 2 - containerRect.left;
      const y1 = dotA.top + dotA.height / 2 - containerRect.top;
      const x3 = dotC.left + dotC.width / 2 - containerRect.left;
      const y3 = dotC.top + dotC.height / 2 - containerRect.top;

      // If there's a "via" point, hide that dot by setting display: none
      if (viaIndex !== null) {
        const dotB = dots[viaIndex];
        dotB.style.visibility = "hidden"; // Hide the via point

        const dotBRect = dotB.getBoundingClientRect();
        const x2 = dotBRect.left + dotBRect.width / 2 - containerRect.left;
        const y2 = dotBRect.top + dotBRect.height / 2 - containerRect.top;

        createCurve(svg, x1, y1, x2, y2, x3, y3);
        line.style.display = 'none'; // Hide dummy div line
      } else {
        createStraightLine(line, x1, y1, x3, y3);
      }
    });
  });
}


// Initial render
window.addEventListener('load', () => {
  setTimeout(updateLines, 10); // 50ms to ensure all other stuff loads, was unreliable
});
// Optional (Container is fixed currently): update on resize
window.addEventListener('resize', updateLines);



//Check values for background (live value, so resizing is also checked)
// grab the elements
const AboutMeContainer = document.getElementById('AboutMeContainer');
const ProjectsContainer = document.getElementById('ProjectsContainer');
const ContactContainer = document.getElementById('ContactContainer');

//To change
const Background_AboutMe = document.getElementById('Background_AboutMe');
const Background_Projects = document.getElementById('Background_Projects');
const Background_Contact = document.getElementById('Background_Contact');

//Get the gap value. Originally 32px, multiplied by 4 later.
const rootStyles = getComputedStyle(document.documentElement);
const GapValue = parseFloat(rootStyles.getPropertyValue('--grid-Gap').trim());

// Define pairs of [sourceId, targetId]
const syncPairs = [
  ['LandingContainer', 'Background_Landing'],
  ['AboutMeContainer', 'Background_AboutMe'],
  ['ProjectsContainer', 'Background_Projects'],
  ['ContactContainer', 'Background_Contact'],
  ['LeftSide', 'Background_Container']
];

// Map them to actual elements
const syncElements = syncPairs.map(([sourceId, targetId]) => {
  return {
    source: document.getElementById(sourceId),
    target: document.getElementById(targetId)
  };
});

//Get and sync the data
function syncBtoA() {
  syncElements.forEach(({ source, target }) => {
    if (source && target) {
      const height = source.getBoundingClientRect().height + (GapValue * 4) + 'px';
      if (target.id != "Background_Container") {
        target.style.height = height;

      }

      //Extra to ensure backgrounds are aligned with the leftSide's gap
      if (target.id == "Background_Container") {
        const leftSideWidth = source.getBoundingClientRect().width + 'px';
        target.style.marginLeft = leftSideWidth;
      }
    }
  });
}

// observe A for any size changes
if (window.ResizeObserver) {
  const observer = new ResizeObserver(syncBtoA);
  syncElements.forEach(({ source }) => {
    if (source) observer.observe(source);
  });
} else {
  // fallback: just sync on load and window resize
  window.addEventListener('resize', syncBtoA);
}

// initial load to sync
window.addEventListener('load', syncBtoA);


//Parallax effect for the background. Slower number  = less movement per scroll.
// Speed configuration for each layer
const layers = [
  { selector: '.Parallax1', speed: 0.2 },
  { selector: '.Parallax2', speed: 0.5 },
  { selector: '.Parallax3', speed: 0.8 }
];

// Fallback function (kept for reference; not used when looped version is active)
function updateParallax() {
  const scrolled = window.scrollY;
  document.querySelector('.Parallax1').style.transform = `translateY(${scrolled * 0.2}px)`;
  document.querySelector('.Parallax2').style.transform = `translateY(${scrolled * 0.5}px)`;
  document.querySelector('.Parallax3').style.transform = `translateY(${scrolled * 0.8}px)`;
}

//Randomise the star locations for Parralax Background

function generateStars(layerSelector, count) {
  const layer = document.querySelector(layerSelector);
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 200 - 50}%`;
    star.style.width = `${Math.random() * 2 + 1}px`; // random size 1-3px, needs +1 to be not 0
    star.style.height = star.style.width;
    layer.appendChild(star);
  }
}
// Core looping update: moves original and its clone based on scroll
function updateParallaxLooped() {
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  layers.forEach(({ selector, speed }) => {
    const offset = (scrollY * speed) % viewportHeight;
    const original = document.querySelector(selector);
    const clone = document.querySelector(`${selector}.clone`);

    // Position the primary and cloned layer
    original.style.transform = `translateY(${offset}px)`;
    clone.style.transform = `translateY(${offset - viewportHeight}px)`;
  });
}

// Initialization on load
window.addEventListener('load', () => {
  // Preserve initial zero-offset for any CSS-based fallback
  document.querySelector('.Parallax1').style.transform = 'translateY(0)';
  document.querySelector('.Parallax2').style.transform = 'translateY(0)';
  document.querySelector('.Parallax3').style.transform = 'translateY(0)';

  // Generate stars for each layer
  generateStars('.Parallax1', 100);
  generateStars('.Parallax2', 80);
  generateStars('.Parallax3', 60);

  // Create and append clones for looping
  layers.forEach(({ selector }) => {
    const original = document.querySelector(selector);
    const clone = original.cloneNode(true);
    clone.classList.add('clone');
    original.parentNode.appendChild(clone);
  });

  // Initial positioning and scroll listener for looped effect
  updateParallaxLooped();
  window.addEventListener('scroll', updateParallaxLooped);

  // Optional fallback listener (commented out)
  // window.addEventListener('scroll', updateParallax);
});


  // Smooth scrolling (default CSS is too jumpy and fast)

  function smoothScroll(target, duration) {
    const targetElement = document.querySelector(target);
    const startPosition = window.pageYOffset;
    const targetPosition = targetElement.getBoundingClientRect().top;
    const distance = targetPosition;
    const startTime = performance.now();

    function scroll() {
      const currentTime = performance.now();
      const timeElapsed = currentTime - startTime;
      const step = easeInOutCubic(timeElapsed, 0, distance, duration);
      
      // Calculate the new scroll position incrementally (smaller steps)
      window.scrollTo(0, startPosition + step);

      if (timeElapsed < duration) {
        requestAnimationFrame(scroll); // Call next frame for smoother steps
      } else {
        window.scrollTo(0, startPosition + distance); // Ensure it ends exactly at the target
      }
    }

    // Easing function (ease-in-out cubic) for smooth motion
    function easeInOutCubic(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t * t + b;
      t -= 2;
      return (c / 2) * (t * t * t + 2) + b;
    }

    scroll();
  }

  // Attach event listener to all navigation buttons
  document.querySelectorAll('.nav_Button').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault(); // Prevent default anchor behavior
      const targetId = this.getAttribute('data-target'); // Get the target section
      smoothScroll(targetId, 2500); // Adjust the duration (in ms) for smoother scrolling
    });
  });