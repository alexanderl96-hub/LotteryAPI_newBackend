const express = require('express');
const router = express.Router();
const tf = require('@tensorflow/tfjs'); 
const tfnode = require('@tensorflow/tfjs') ;

function convertToTensor(data) {
    let inputs = [];
    let labels = [];
  
    data.forEach(d => {
      inputs.push(d); // All elements except the first as inputs
      labels.push(d[0]); // First element as the label
    });
  
    const inputTensor = tf.tensor2d(inputs, [inputs.length, inputLength]);
    const labelTensor = tf.tensor2d(labels, [labels.length, 1]);
  
    const inputMax = Math.max(...data.flat(Infinity));
    const inputMin = Math.min(...data.flat(Infinity));
    const labelMax = Math.max(...labels);
    const labelMin = Math.min(...labels);
  
    const normalizedInputs = inputTensor.sub(tf.scalar(inputMin)).div(tf.scalar(inputMax - inputMin));
    const normalizedLabels = labelTensor.sub(tf.scalar(labelMin)).div(tf.scalar(labelMax - labelMin));
  
    return {
      inputs: normalizedInputs,
      labels: normalizedLabels,
      inputMax,
      inputMin,
      labelMax,
      labelMin
    };
  }
  

  router.post('/', async (req, res) => {
    // Extract data from the body
    const numbersDataStr = req.body.predict;
    const numbersData = numbersDataStr.map(Number);
    const nameOfData = req.body.name
    inputLength = numbersDataStr[0].length
  
    console.log(inputLength,'inputLength inputLength')
    const model = tf.sequential();
      model.add(tf.layers.dense({units: 64, activation: 'relu', inputShape: [inputLength]}));
      model.add(tf.layers.dense({units: 1}));
  
      // Compile the model
      model.compile({
      optimizer: 'adam',
      loss: 'meanSquaredError',
      metrics: ['mse'],
      });
  
      const earlyStopping = tf.callbacks.earlyStopping({
        monitor: 'val_loss',
        patience: 10
      });
  
      // const lrScheduler = tf.callbacks.learningRateScheduler((epoch) => {
      //   let lr = model.optimizer.learningRate;
      //   if (epoch > 20) {
      //     lr *= 0.9; // Reduce learning rate by 10% every 20 epochs
      //   }
      //   return lr;
      // });
  
    // Ensure numbersData is an array of arrays
    if (!Array.isArray(numbersData)) {
      return res.status(400).send('Invalid data format');
    }
  
    // Prepare data by ensuring each sequence has the correct length
    const preparedData = numbersDataStr.map(seq => {
      // Fill sequences with zeros to meet the required length
      const filledSeq = seq.concat(Array(inputLength - seq.length).fill(0));
  
      return filledSeq;
    });
  
  
  
    // Convert prepared data to tensors
    const tensorData = convertToTensor(preparedData);
    const { inputs, labels, inputMax, inputMin, labelMax, labelMin } = tensorData;
  
    console.log(inputMin, inputMax, nameOfData, 'check range')
  
    // Train the model (optional, uncomment if you have training data)
    await model.fit(inputs, labels, {
      batchSize: 64,
      epochs: 100,
      validationSplit: 0.1,
      callbacks: [earlyStopping],
    });
  
    // Make predictions
    try {
      const inputMaxTensor = tf.tensor1d([inputMax], 'float32');
      const inputMinTensor = tf.tensor1d([inputMin], 'float32');
      
      // Make predictions
      const readablePredictions = await model.predict(inputs);
      
      // Un-normalize the predictions
      const unNormPreds = readablePredictions.mul(inputMaxTensor.sub(inputMinTensor)).add(inputMinTensor);
  
      // Convert predictions to a more readable format if necessary
      const result = unNormPreds.arraySync()
    .map(parseFloat) // Convert string representations of numbers to floats
    .map(Math.round) // Round each number to the nearest integer
    .flat(Infinity)
    .filter(v => v >= inputMin && v <= inputMax ) // Flatten the array if it's nested
    ; 


    // Create an object to count occurrences
   const numberCount = {};

     result.forEach(num => {
          if (numberCount[num]) {
            numberCount[num]++;
          } else {
            numberCount[num] = 1;
          }
        });


        // console.log("Numbercount: ", numberCount)

        let filteredValues;

        if(nameOfData === "Pick 10"){

            filteredValues = Object.entries(numberCount)
                                   .filter(([key, value]) => [3, 4, 5, 7, 6, 18, 14, 12, 9, 10, 11, 17, 19].includes(Number(key)))
                                   .map(([, value]) => value);

        }else if(nameOfData === "Mega Millions"){

        }else if(nameOfData === "PowerBall"){

          filteredValues = Object.entries(numberCount)
                                   .filter(([key, value]) => [4, 2, 1, 3, 14, 12, 13, 11].includes(Number(value)))
                                   .map(([key, value]) => Number(key));

        }else if(nameOfData === "NewYork Lotto"){

        }else if(nameOfData === "Cash4Life"){

        }else if(nameOfData === "Take 5"){

        }else if(nameOfData === "Win 4"){

        }else if(nameOfData === "Numbers"){

        }


      const uniqueValues = new Set(filteredValues);  // No need to spread into an array, Set already handles uniqueness
      
      console.log("Result: ", Array.from(uniqueValues).sort((a, b) => a - b)); 
      const uniqueResult = Array.from(uniqueValues).sort((a, b) => a - b)

      res.json({ predictions: uniqueResult  });
    } catch (error) {
      console.error('Failed to make predictions:', error);
      return res.status(500).send('Failed to make predictions');
    }
  });
  

  module.exports = router;