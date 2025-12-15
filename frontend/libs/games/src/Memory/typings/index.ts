import { type ElementType } from 'react';

export type CardData = {
  type: string;
  image: ElementType;
  secondImage: ElementType;
  color: 'default' | 'hard';
  complexity: 'normal' | 'high';
};
