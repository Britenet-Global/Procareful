import { type Key, ProcarefulAppPathRoutes, useTypedTranslation } from '@Procareful/common/lib';
import { useThemeContext } from '@Procareful/ui';
import TopBarLayout from '@ProcarefulApp/layout/TopBarLayout';
import { DEFAULT_FONT_SIZE, FONTSIZE_OPTIONS } from '@ProcarefulApp/screens/Setttings/constants';
import { useState } from 'react';
import { Button, Radio, type RadioChangeEvent } from 'antd';
import { useStyles } from './styles';

const Settings = () => {
  const { theme, updateTheme } = useThemeContext();
  const [fontSize, setFontSize] = useState(theme?.token?.fontSize ?? DEFAULT_FONT_SIZE);

  const { styles } = useStyles();
  const { t } = useTypedTranslation();

  const onFontSizeChange = (e: RadioChangeEvent) => {
    setFontSize(e.target.value);
  };

  const onSubmitHandler = () => updateTheme({ token: { fontSize } });

  const options = Object.entries(FONTSIZE_OPTIONS).map(([key, value]) => (
    <Radio key={value} value={value} className={styles[key as keyof typeof styles]}>
      {t(`senior_inf_fontsize_${key}` as Key)}
    </Radio>
  ));

  return (
    <TopBarLayout backTo={ProcarefulAppPathRoutes.Dashboard}>
      <div className={styles.container}>
        <span className={styles.description} style={{ fontSize }}>
          {t('senior_inf_settings_description')}
        </span>
        <Radio.Group
          size="large"
          className={styles.radioGroup}
          value={fontSize}
          onChange={onFontSizeChange}
        >
          {options}
        </Radio.Group>
        <Button onClick={onSubmitHandler} type="primary" size="large" className={styles.button}>
          {t('shared_btn_save')}
        </Button>
      </div>
    </TopBarLayout>
  );
};

export default Settings;
