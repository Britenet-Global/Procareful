import type { CardData } from './typings';

const shuffleCards = (array: CardData[]) => {
  const length = array.length;
  for (let i = length; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * i);
    const currentIndex = i - 1;
    const temp = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temp;
  }

  return array;
};

export const generateGameArray = (
  uniqueCardsArray: CardData[],
  cardComplexity: number,
  numberOfCardsToPair: number
) => {
  if (numberOfCardsToPair <= 0) {
    throw new Error('Invalid difficulty level');
  }

  if (numberOfCardsToPair > uniqueCardsArray.length * 2) {
    throw new Error('Not enough unique elements in the initial array to generate game array');
  }

  const selectedCards = uniqueCardsArray
    .filter(card => {
      if (cardComplexity !== 3) {
        return card.complexity === 'normal';
      }

      return card;
    })
    .slice(0, cardComplexity !== 3 ? numberOfCardsToPair / 2 : numberOfCardsToPair / 4);

  const cardsToPlay = () => {
    if (cardComplexity === 3) {
      const duplicateCardsToPairs = selectedCards.concat(selectedCards);

      const createAndChangeHalfPairsColor = duplicateCardsToPairs.flatMap((card, index) => {
        const cardWithDifferentColor = { ...card, color: 'hard' as const };
        if (index % 2 === 1) {
          return [card, { ...card }];
        }

        return [cardWithDifferentColor, cardWithDifferentColor];
      });

      return createAndChangeHalfPairsColor;
    }
    const createPairs = selectedCards.flatMap(card => [
      card,
      { ...card, color: 'default' as const },
    ]);

    return createPairs;
  };

  const gameArray = cardsToPlay();

  const shuffledCards = shuffleCards(gameArray);

  return shuffledCards;
};
