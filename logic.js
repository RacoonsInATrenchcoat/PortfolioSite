//Logic for calculating the position of Dots and drawing Lines between them

const container = document.getElementById('Background_AboutMe');
const dots = Array.from(container.querySelectorAll('.dot'));
const lines = container.querySelectorAll('.line');

function updateLines() {
    //Gets the Container's absolute position and size
    const containerRect = container.getBoundingClientRect();

    lines.forEach(line => {

        //Gets the data for each line's connection from the HTML "data-from="0" data-to="1""
        const fromIndex = +line.dataset.from;
        const toIndex = +line.dataset.to;

        //Gets the on-screen position of each dot
        const dotA = dots[fromIndex].getBoundingClientRect();
        const dotB = dots[toIndex].getBoundingClientRect();

        //Gets X/Y coordinate of each dot, by checking distance then minus the container's 0 (topleft) point.
        const x1 = dotA.left + dotA.width / 2 - containerRect.left;
        const y1 = dotA.top + dotA.height / 2 - containerRect.top;
        const x2 = dotB.left + dotB.width / 2 - containerRect.left;
        const y2 = dotB.top + dotB.height / 2 - containerRect.top;

        //Difference between dots gets the length and angle for the line
        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;

        //Adds the above details (position, length, angle) for the line
        //Overwrites the original CSS details via "transform" values
        line.style.left = `${x1}px`;
        line.style.top = `${y1}px`;
        line.style.width = `${length}px`;
        line.style.transform = `rotate(${angle}deg)`;
    });
}

// Initial render
window.addEventListener('load', updateLines);
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
    ['LandingContainer','Background_Landing'],
    ['AboutMeContainer', 'Background_AboutMe'],
    ['ProjectsContainer', 'Background_Projects'],
    ['ContactContainer', 'Background_Contact'],
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
        const height = source.getBoundingClientRect().height + (GapValue * 4 ) + 'px';
        target.style.height = height;
        target.style.marginLeft = GapValue + 'px';
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