/**
 * UI events.
 */

const sliderX = document.getElementById('rotation-slider-x');
const sliderY = document.getElementById('rotation-slider-y');
const sliderZ = document.getElementById('rotation-slider-z');

const ui = {
  setupRotationSliders: function(cb) {
    
    sliderX.oninput = (e) => {
      const sliderValue = e.target.value;

      this.update(sliderValue, null, null);
      cb(0, sliderValue);
    };

    sliderY.oninput = (e) => {
      const sliderValue = e.target.value;

      this.update(null, sliderValue, null);
      cb(1, sliderValue);
    };

    sliderZ.oninput = (e) => {
      const sliderValue = e.target.value;

      this.update(null, null, sliderValue);
      cb(2, sliderValue);
    };
  },

  /**
   * Update sliders : element (if modelUpdate) and text.
   * This method is called on each view (slider input) and model (index.js) update.
   */
  update: function(xRotation, yRotation, zRotation, modelUpdate) {
    if (xRotation) {
      const textValueX = document.getElementById('rotation-value-x');
      textValueX.innerHTML = xRotation;

      if (modelUpdate) {
        sliderX.value = xRotation;
      }
    }

    if (yRotation) {
      const textValueY = document.getElementById('rotation-value-y');
      textValueY.innerHTML = yRotation;

      if (modelUpdate) {
        sliderY.value = yRotation;
      }
    }

    if (zRotation) {
      const textValueZ = document.getElementById('rotation-value-z');
      textValueZ.innerHTML = zRotation;

      if (modelUpdate) {
        sliderZ.value = zRotation;
      }
    }
  }
};

export default ui;