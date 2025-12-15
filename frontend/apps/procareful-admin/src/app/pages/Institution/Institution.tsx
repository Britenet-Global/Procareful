import InfoTile from '@ProcarefulAdmin/components/InfoTile';
import { getInstitutionConfig } from './constants';
import { useStyles } from './styles';

const Institutions = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.container}>
      {getInstitutionConfig?.map(({ id, ...settingOptionProps }) => (
        <InfoTile
          key={id}
          variant="link"
          shadow
          containerStyle={styles.tileContainer}
          {...settingOptionProps}
        />
      ))}
    </div>
  );
};

export default Institutions;
