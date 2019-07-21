export const getHumanType = (type: string): string => {
  if (type === 'goalkeeper') {
    return 'Goleiro';
  }
  else if (type === 'defender') {
    return "Zagueiro";
  }
  if (type === 'midfielder') {
    return "Meio campo";
  }
  if (type === 'forward') {
    return "Atacante";
  }
  return '';
};
