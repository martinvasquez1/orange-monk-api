const colors = ['text-primary', 'text-secondary', 'text-accent', 'text-success'];

function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

module.exports = getRandomColor;
