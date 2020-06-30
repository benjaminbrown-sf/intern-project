const fixCasing = (str: string): string => {
  return str.toLowerCase().charAt(0).toUpperCase() + str.toLowerCase().slice(1);
};

export default fixCasing;
