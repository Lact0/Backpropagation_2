class NeuralNetwork {
  //numIn is an int of inputs
  //dim is an array, where the length is the number of layers and
  //the ints inside are the depth of each layer
  //activationFunctions is an array w/ the same length as dim, where
  //a function is an array [func, dx/dy]
  constructor(numIn, dim, activationFunctions) {
    if(dim.length != activationFunctions.length) {
      return false;
    }
    this.numIn = numIn;
    this.dim = dim;
    this.actFunc = activationFunctions;
    this.weights = [];
    for(let i = 0; i < dim.length; i++) {
      const layer = [];
      for(let j = 0; j < dim[i]; j++) {
        const neuron = [];
        for(let k = 0; k < dim[i - 1] || numIn; k++) {
          neuron.push(Math.random() * 2 - 1);
        }
        layer.push(neuron);
      }
      this.weights.push(layer);
    }
  }

  draw(x, y, w, h) {
    
  }
}