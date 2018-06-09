/**
 * UI events.
 */

'use strict';

function setAngleSlider(cb) {
  const slider = document.getElementById('angle-slider');
  const textValue = document.getElementById('angle-value');
  
  slider.oninput = (e) => {
    const sliderValue = e.target.value;
    textValue.innerHTML = sliderValue;
    cb(e.target.value);
  };
}
