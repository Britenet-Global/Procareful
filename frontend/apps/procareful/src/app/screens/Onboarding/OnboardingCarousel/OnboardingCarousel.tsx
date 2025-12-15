import { Text, Title } from '@Procareful/ui';
import { Image } from 'antd';
import { useStyles } from './styles';

type OnboardingCarouselProps = {
  heading: string;
  description: string;
  imagePath: string;
};

const OnboardingCarousel = ({ heading, description, imagePath }: OnboardingCarouselProps) => {
  const { styles, cx } = useStyles();

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.textContainer}>
        <Title level={3} className={styles.heading}>
          {heading}
        </Title>
        <Text className={styles.description}>{description}</Text>
      </div>
      <div className={styles.imageContainer}>
        <Image
          className={cx(styles.carouselImage, {
            [styles.shadowImage]: imagePath.includes('onboarding_exercises'),
          })}
          preview={false}
          src={imagePath}
        />
      </div>
    </div>
  );
};
export default OnboardingCarousel;
