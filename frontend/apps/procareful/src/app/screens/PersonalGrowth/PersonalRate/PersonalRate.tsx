import { useTypedTranslation } from '@Procareful/common/lib';
import { SearchParams, LocalStorageKey } from '@Procareful/common/lib/constants';
import ChallengeRatingRadioButton from '@ProcarefulApp/components/ChallengeRatingRadioButton';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from 'antd';
import { getNewSearchParams } from '../helpers';
import { personalRateItems } from './constants';
import { useStyles } from './styles';

const PersonalRate = () => {
  const { styles } = useStyles();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTypedTranslation();
  const personalRateFromLocalStorage = localStorage.getItem(LocalStorageKey.PersonalGrowthData);
  const personalRateParsed = personalRateFromLocalStorage
    ? JSON.parse(personalRateFromLocalStorage)
    : {};
  const [personalRate, setPersonalRate] = useState(personalRateParsed?.personalRate || undefined);
  const personalGrowthId = searchParams.get(SearchParams.Id);

  const handleSubmit = () => {
    if (!personalGrowthId) {
      return;
    }

    localStorage.setItem(
      LocalStorageKey.PersonalGrowthData,
      JSON.stringify({
        personalRate: personalRate,
      })
    );

    const newSearchParams = getNewSearchParams({ searchParams, stepNumber: 2, personalGrowthId });
    setSearchParams(newSearchParams, { replace: true });
  };

  return (
    <div className={styles.container}>
      <ChallengeRatingRadioButton
        label={t('senior_form_how_was_the_challenge')}
        options={personalRateItems}
        value={personalRate}
        onChange={setPersonalRate}
      />
      <Button
        type="primary"
        disabled={!personalRate}
        className={styles.submitButton}
        size="large"
        onClick={handleSubmit}
      >
        {t('shared_btn_save')}
      </Button>
    </div>
  );
};

export default PersonalRate;
