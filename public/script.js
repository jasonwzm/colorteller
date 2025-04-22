document.addEventListener('DOMContentLoaded', function() {
  const colorBox = document.getElementById('color-box');
  const colorName = document.getElementById('color-name');
  const refreshBtn = document.getElementById('refresh-btn');
  const regionSelect = document.getElementById('region-select');
  
  const userId = 'user-' + Math.floor(Math.random() * 1000000);
  
  function getColorName(color) {
    const colorMap = {
      '#ff0000': 'Red',
      '#00ff00': 'Green',
      '#0000ff': 'Blue',
      '#ffff00': 'Yellow',
      '#ff00ff': 'Magenta',
      '#00ffff': 'Cyan',
      '#ffa500': 'Orange',
      '#800080': 'Purple',
      '#008000': 'Green',
      '#808080': 'Gray'
    };
    
    const normalizedColor = color.toLowerCase();
    
    if (colorMap[normalizedColor]) {
      return colorMap[normalizedColor];
    }
    
    if (!normalizedColor.startsWith('#')) {
      return normalizedColor.charAt(0).toUpperCase() + normalizedColor.slice(1);
    }
    
    return 'Custom Color';
  }
  
  async function fetchColorFromServer() {
    try {
      colorName.textContent = 'Loading...';
      
      const region = regionSelect.value;
      
      const response = await fetch(`/api/color?userId=${userId}&region=${region}`);
      const data = await response.json();
      
      if (response.ok) {
        updateColorDisplay(data.color);
      } else {
        throw new Error(data.error || 'Failed to fetch color');
      }
    } catch (error) {
      console.error('Error fetching color:', error);
      updateColorDisplay('gray', true);
    }
  }
  
  function updateColorDisplay(colorValue, isError = false) {
    let displayColor = colorValue;
    if (!displayColor.startsWith('#') && !displayColor.startsWith('rgb')) {
      const tempElement = document.createElement('div');
      tempElement.style.color = displayColor;
      document.body.appendChild(tempElement);
      
      const computedColor = window.getComputedStyle(tempElement).color;
      document.body.removeChild(tempElement);
      
      displayColor = computedColor;
    }
    
    colorBox.style.backgroundColor = displayColor;
    
    if (isError) {
      colorName.textContent = 'Error';
    } else {
      colorName.textContent = getColorName(colorValue);
    }
    
    document.body.style.backgroundColor = `${displayColor}10`;
  }
  
  fetchColorFromServer();
  
  refreshBtn.addEventListener('click', function() {
    fetchColorFromServer();
  });
  
  regionSelect.addEventListener('change', function() {
    fetchColorFromServer();
  });
}); 
