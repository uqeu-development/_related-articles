// INTIALISE VARIABLES. CODE HASN'T RUN YET
var lazyLoadRun = false;
var theFunctionRun = false;
var slickRun = false;
var magnificRun = false;

// FUNCTION TO LOAD IN ADDITIONAL JS LIBRARIES. JQUERY IS INCLUDED ON THE PAGE BY DEFAULT ON THE MOBILE CMS
function loadScript(url, callback) {
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;
    // Fire the loading
    head.appendChild(script);
}


var theFunction = function () {
    if (theFunctionRun === false) {
        console.log('the function called')


        theFunctionRun = true;
    } else {

    }
}

var lazyLoad = function () {
    // CHECK WHETHER THIS CODE HAS RUN ALREADY
    if (lazyLoadRun === false) {
        console.log("lazyLoad called");

        var pageLazyLoad = new LazyLoad({
            elements_selector: "[loading=lazy]",
            use_native: true // ← enables hybrid lazy loading
        });
        lazyLoadRun = true;
    } else { }
};

var slick = function () {
    if (slickRun === false) {
        console.log('slickCode called')

        slickRun = true;
    }
    else {

    }
}


var magnificCode = function () {
    // CHECK WHETHER THIS CODE HAS RUN ALREADY
    if (magnificRun === false) {
        console.log("magnificCode called");
        //PUT YOUR CODE HERE SO IT RUNS ONLY ONCE. CMS BUG CALLS JAVASCRIPT TWICE ON EACH PAGE SO THIS IS HOW IT'S SOLVED

        magnificRun = true;
    } else { }
};

loadScript("https://cdn.jsdelivr.net/gh/uqeu-development/theFunction@latest/theFunction.js", theFunction)
loadScript("https://cdn.jsdelivr.net/npm/vanilla-lazyload@17.1.3/dist/lazyload.min.js", lazyLoad);
loadScript("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js", slick)