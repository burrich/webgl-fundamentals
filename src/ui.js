/**
 * UI events.
 */
const ui = {
  setAngleSlider: function(cb) {
    const slider = document.getElementById('angle-slider');
    const textValue = document.getElementById('angle-value');
    
    slider.oninput = (e) => {
      const sliderValue = e.target.value;
      textValue.innerHTML = sliderValue;
      cb(e.target.value);
    };
  }
};

export default ui;