// Code for menu
var menu = document.getElementById('menu');
document.getElementById('open-menu').addEventListener('click', function () {
    menu.classList.remove('hidden');
    menu.classList.add('block');
});
document.getElementById('close-menu').addEventListener('click', function () {
    menu.classList.remove('block');
    menu.classList.add('hidden');
});

// Code for back to top button.
document.querySelector('.elevator-button').addEventListener('click', function () {
    scrollTo(document.body, 300);
});

// Animation in header homepage.
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

// Code for the audio player with transcript.
var audio_els = document.querySelectorAll('audio.with-transcript');
[].forEach.call(audio_els, function (audio_el) {
    var source = document.querySelector('source').src;
    var transcript_lines = document.querySelectorAll('p.transcript-line');
    var timecodes = {};
    var markers = [];
    [].forEach.call(transcript_lines, function (transcript_line) {
        // get timecode from data attribute
        var timecode = transcript_line.getAttribute('data-timecode');
        if (timecode && timecode.length) {
            // build object of timecodes and element offsets
            timecodes[ timecode ] = {};
            timecodes[ timecode ]['el'] = transcript_line;
            timecodes[ timecode ]['offset'] = transcript_line.offsetTop;

            // Look for marker class, then add marker if found.
            if (transcript_line.classList.contains('timecode-marker')){
                var timeparts = timecode.split(':');
                // parse parts as ints
                timeparts.forEach(function (index, val){
                    timeparts[index] = parseInt(val);
                });
                var seconds = calc_seconds(timeparts);
                markers.push(seconds);
            }
        }
    });

    // set up the scroll tether to audio timecode
    audio_el.addEventListener('timeupdate', function(){
        var current_time = audio_el.currentTime;
        var current_hours = formatNumber(parseInt(current_time / 360, 10));
        var current_minutes = formatNumber(parseInt(current_time / 60, 10));
        var current_seconds = formatNumber(parseInt(current_time % 60));

        var timecode_index = current_hours + ":" + current_minutes + ":" + current_seconds;

        if (typeof timecodes[timecode_index] !== 'undefined'){
            if (!timecodes[timecode_index]['el'].classList.contains('current')){
                var current = document.querySelector('.current');
                if (current && current != null && current.classList){
                    current.classList.remove('current');
                }
                timecodes[timecode_index]['el'].classList.add('current');

                // Scroll to the place in the transcript.
                scrollTo(timecodes[timecode_index]['offset'], 500);
                // Update the # in the URL.
                document.location.hash = 't='+timecode_index;
            }
        }
    });
});

function formatNumber(n){
    return n > 9 ? "" + n: "0" + n;
}

function calc_seconds (array) {
    var sum = 0;
    switch(array.length){
        case 1:
            sum += array[0];
            break;
        case 2:
            sum += (array[0]*60);
            sum += array[1];
            break;
        case 3:
            sum += (array[0]*60*60);
            sum += (array[1]*60);
            sum += array[2];
            break;
    }
    return sum;
}
