export var Util = {
  getColorByNumber: function(number){
    let color = 'Red';
    switch (number) {
      case 0: color = 'LightSeaGreen'; break;
      case 1: color = 'LightSalmon'; break;
      case 2: color = 'MediumTurquoise'; break;
      case 3: color = 'Orange'; break;
      case 4: color = 'SlateBlue'; break;
    }
    return color;
  }
}
