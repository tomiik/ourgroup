export var Util = {
  getColorByNumber: function(number){
    let color = 'Red';
    switch (number) {
      case 0: color = 'dodgerblue'; break;
      case 1: color = 'limegreen'; break;
      case 2: color = 'Orange'; break;
      case 3: color = 'SlateBlue'; break;
      case 4: color = 'MediumTurquoise'; break;
      case 5: color = 'mediumblue'; break;
    }
    return color;
  }
}
