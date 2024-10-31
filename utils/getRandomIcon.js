const icons = ['bomb', 'burger', 'crow', 'dharmachakra', 'diceFive', 'fortAwesome'];

function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * icons.length);
  return icons[randomIndex];
}

module.exports = getRandomColor;
