export default interface Player {
  name: string,
  id: number
  type: 'goalkeeper' | 'player',
  stars: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
  availableToPlay: boolean
}