//ACTIVATION FUNCTIONS
const sigmoid = {
  f: z => (1 / (1 + Math.exp(-z))),
  d: z => sigmoid.f(z) * (1 - sigmoid.f(z))
};
const relu = {
  f: z => max(0, z),
  d: z => {
    if(z < 0) {
      return 0;
    } else {
      return 1;
    }
  }
};

class NeuralNetwork {
  //numIn is an int of inputs
  //dim is an array, where the length is the number of layers and
  //the ints inside are the depth of each layer
  //activationFunctions is an array w/ the same length as dim, where
  //a function is an array [func, dx/dy]
  constructor(numIn, dim, activationFunctions = []) {
    while(dim.length > activationFunctions.length) {
      activationFunctions.push(sigmoid);
    }
    this.numIn = numIn;
    this.dim = dim;
    this.actFunc = activationFunctions;
    this.weights = [];
    this.biases = [];
    for(let i = 0; i < dim.length; i++) {
      let layer = [];
      let biasLayer = [];
      for(let j = 0; j < dim[i]; j++) {
        biasLayer.push(Math.random() * 2 - 1);
        let node = [];
        const loop = i == 0? numIn : dim[i - 1];
        for(let k = 0; k < loop; k++) {
          node.push(Math.random() * 2 - 1);
        }
        layer.push(node);
      }
      this.weights.push(layer);
      this.biases.push(biasLayer);
    }
    console.log(this.weights);
  }

  draw(x, y, w, h) {
    ctx.strokeStyle = 'white';
    let xSpace = w / (this.dim.length + 1);
    let r = h / max(Math.max(...this.dim, this.numIn), this.dim.length + 1) / 4;
    for(let i = 0; i < this.dim.length; i++) {
      let ySpace = h / this.dim[i];
      for(let j = 0; j < this.dim[i]; j++) {
        ctx.beginPath();
        ctx.arc(xSpace * (i + 2) - xSpace / 2, ySpace * (j + 1) - ySpace / 2, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    let ySpace = h / this.numIn;
    for(let j = 0; j < this.numIn; j++) {
      ctx.beginPath();
      ctx.arc(xSpace / 2, ySpace * (j + 1) - ySpace / 2, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  pass(inp) {
    if(inp.length != this.numIn) {
      return false;
    }
    let nextIn = inp;
    for(let l = 0; l < this.weights.length; l++) {
      const layer = this.weights[l];
      const newIn = [];
      for(let j = 0; j < layer.length; j++) {
        const node = layer[j];
        let sum = this.biases[l][j];
        for(let i = 0; i < node.length; i++) {
          sum += node[i] * nextIn[i];
        }
        newIn.push(this.actFunc[l].f(sum));
      }
      nextIn = newIn;
    }
    
    return nextIn;
  }

  getGradient(inp, ans) {
    const weightGradient = this.weights.map((x) => x);
    const biasGradient = this.biases.map((x) => x);
    
    const inputs = [inp];
    const outputs = [];
    for(let l = 0; l < this.weights.length; l++) {
      const layer = this.weights[l];
      let newIn = [];
      const newOut = [];
      for(let j = 0; j < layer.length; j++) {
        const node = layer[j];
        let sum = this.biases[l][j];
        for(let i = 0; i < node.length; i++) {
          sum += node[i] * inputs[inputs.length - 1][i];
        }
        newOut.push(sum);
        newIn.push(this.actFunc[l].f(sum));
      }
      outputs.push(newOut);
      inputs.push(newIn);
    }
    inputs.shift();

    let dInputs = inputs.map((x) => x);
    let dOutputs = outputs.map((x) => x);
    
    const finalInd = outputs.length - 1;
    
    //MAIN LOOP FOR BACKPROPOGATION
    for(let i = finalInd; i >= 0; i--) {
      
      //TEST IF THIS IS THE FIRST CASE, FIND ERROR COST
      //GET DX/DY OF OUTPUT AND INPUT OF LAYER
      //ALSO GET THE BIASES
      for(let j = 0; j < dOutputs[i].length; j++) {
        
        if(i == finalInd) {
          dOutputs[finalInd][j] = (2 * dOutputs[finalInd][j]) - (2 * ans[j]);
        } else {
          let sum = 0;
          //Sum up layer afterwards
          for(let k = 0; k < dInputs[i + 1].length; k++) {
            //Sum is derivative of input * weight conn
            sum += dInputs[i + 1][k] * this.weights[i + 1][k][j];
          }
          dOutputs[i][j] = sum;
        }
        dInputs[i][j] = dOutputs[i][j] * this.actFunc[i].d(dInputs[i][j]);
      }
      
      //GET DX/DY OF WEIGHTS
      //(weights behind the current layer)
      for(let j = 0; j < this.dim[i]; j++) {
        let numK;
        if(i - 1 < 0) {
          numK = this.numIn;
        } else {
          numK = this.weights[i - 1][j].length
        }
        for(let k = 0; k < numK; k++) {
          weightGradient[i][j][k] = dInputs[i][j] * outputs[i][k];
        }
      }  
    }
    
    return [weightGradient, biasGradient];
  }
}