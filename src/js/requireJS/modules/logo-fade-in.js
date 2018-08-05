define(
  [
    'modules/services'
  ],
  function(
    services
  ){
    // console.log('loaded :: js/modules/logo-fade-in.js');

    // onload :: fade in dmg logo

    var img = document.querySelector('.logo img.display-none');
    
    services.removeClass(img, 'display-none');
  }
);
