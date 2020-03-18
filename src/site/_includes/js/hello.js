// btnHandler('.btn-log', function () {
//   console.log('👋 Oh, hello there you!');
// });

// var elevator = new Elevator({
//   element: document.querySelector('.elevator-button'),
//   duration: 1000 // milliseconds
// });

// // Simple elevator usage.
// var elementButton = document.querySelector('.elevator');
// var elevator = new Elevator({
//   element: elementButton,
//   mainAudio: './music/elevator.mp3', // Music from http://www.bensound.com/
//   endAudio: './music/ding.mp3'
// });

var paths = document.querySelectorAll('.st0');
[].forEach.call(paths, function (path) {
  var length = path.getTotalLength();
  path.style.transition = path.style.WebkitTransition = 'none';
  path.style.strokeDasharray = length + ' ' + length;
  path.style.strokeDashoffset = length;
  path.getBoundingClientRect();
  path.style.transition = path.style.WebkitTransition = 'stroke-dashoffset 4s ease-in-out';
  path.style.strokeDashoffset = '0';
});

// Detect request animation frame
var scroll = window.requestAnimationFrame ||
  // IE Fallback
  function (callback) { window.setTimeout(callback, 1000 / 60) };

var elementsToShow = document.querySelectorAll('.show-on-scroll');

function loop() {

  Array.prototype.forEach.call(elementsToShow, function (element) {
    if (isElementInViewport(element)) {
      element.classList.add('is-visible');
    } else {
      element.classList.remove('is-visible');
    }
  });

  scroll(loop);
}

// Call the loop for the first time
loop();

// Helper function from: http://stackoverflow.com/a/7557433/274826
function isElementInViewport(el) {

  var rect = el.getBoundingClientRect();
  return (
    (rect.top <= 0
      && rect.bottom >= 0)
    ||
    (rect.bottom >= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.top <= (window.innerHeight || document.documentElement.clientHeight))
    ||
    (rect.top >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight))
  );
}

// var hero = document.getElementById('hero').clientHeight;
// document.getElementById('radialWide').style.height = (hero + 248) + "px";
// document.getElementById('radialNarrow').style.height = (hero + 128) + "px";
