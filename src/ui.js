/**
 * UI events.
 */
const ui = {
  setupRotationSliders: function(cb) {
    const sliderX = document.getElementById('rotation-slider-x');
    const sliderY = document.getElementById('rotation-slider-y');
    const sliderZ = document.getElementById('rotation-slider-z');
    
    const textValueX = document.getElementById('rotation-value-x');
    const textValueY = document.getElementById('rotation-value-y');
    const textValueZ = document.getElementById('rotation-value-z');

    sliderX.oninput = (e) => {
      const sliderValue = e.target.value;
      textValueX.innerHTML = sliderValue;

      cb(0, sliderValue);
    };

    sliderY.oninput = (e) => {
      const sliderValue = e.target.value;
      textValueY.innerHTML = sliderValue;

      cb(1, sliderValue);
    };

    sliderZ.oninput = (e) => {
      const sliderValue = e.target.value;
      textValueZ.innerHTML = sliderValue;

      cb(2, sliderValue);
    };
  }
};

export default ui;