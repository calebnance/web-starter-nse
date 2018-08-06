import { addClass, removeClass } from './modules/services';

setTimeout(() => {
  console.log('es6 be working and stuff');
}, 1000);


// logo fade in
////////////////////////////////
var img = document.querySelector('.logo img.display-none');
removeClass(img, 'display-none');

// logo fade out
////////////////////////////////
setTimeout(() => {
  var img = document.querySelector('.logo img.fadeIn');
  removeClass(img, 'fadeIn');

  // using this class reference only within js
  // to try and break purgecss's logic
  addClass(img, 'fadeOut');
  console.log('test of purgecss .fadeOut just happened :: worked!');
}, 3000);
