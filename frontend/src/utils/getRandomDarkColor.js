const getRandomDarkColor = () => {
  // Generate random RGB values with a bias towards darker shades
  const red = Math.floor(Math.random() * 100); // 0-99
  const green = Math.floor(Math.random() * 100); // 0-99
  const blue = Math.floor(Math.random() * 100); // 0-99

  // Convert to a valid hex color
  return `rgb(${red}, ${green}, ${blue})`;
};

export default getRandomDarkColor;
