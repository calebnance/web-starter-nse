define([], function(){
  // console.log('loaded :: js/modules/shared/prevent-default.js');

  // click :: prevent default click on href that starts with a hash

  // grab all hashs
  var hashs = document.querySelectorAll('a[href^="#"]');

  // loop through hashs
  for(var i=0; i < hashs.length; i++) {
    // add event listeners for the elements on the page
    hashs[i].addEventListener('click', function(e){
      e.preventDefault();
    }, false);
  }
});
