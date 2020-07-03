export const fixCasing = (str: string) => {
  return str.toLowerCase().charAt(0).toUpperCase() + str.toLowerCase().slice(1);
};
