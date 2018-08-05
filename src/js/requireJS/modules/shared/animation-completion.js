define(
  [],
  function(){
    // console.log('loaded :: js/modules/shared/animation-completion.js');

    // animation :: listeners for animation end
    var animes = document.querySelectorAll('.anime');

    // loop through animations
    for(var i=0; i < animes.length; i++) {
      // add event listeners for: Chrome, Safari and Opera
      animes[i].addEventListener('webkitAnimationEnd', function(e){
        // animation ended!
        // console.log(e);
        // console.log('webkit animation ended! :: doSomething(now)');
      }, false);

      // add event listeners for Standard Syntax
      animes[i].addEventListener('animationend', function(e){
        // animation ended!
        // console.log(e);
        // console.log('standard animation ended! :: doSomething(now)');
      }, false);
    }
  }
);
