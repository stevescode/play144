export const generateSums = () => {
    const sums = [];
    for (let i = 1; i <= 12; i++) {
      for (let j = 1; j <= 12; j++) {
        sums.push({ num1: i, num2: j, answer: i * j });
      }
    }
    return shuffle(sums);
  };
  
  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };