
export const toCssClasse = (numbers) => {
    const cols = numbers ? numbers.split(' ') : []
    let classes = ''
  
    if (cols[0]) classes += ` col-xs-${cols[0]}`
    if (cols[1]) classes += ` col-sm-${cols[1]}`
    if (cols[2]) classes += ` col-md-${cols[2]}`
    if (cols[3]) classes += ` col-lg-${cols[3]}`
  
    return classes;
}

export const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}