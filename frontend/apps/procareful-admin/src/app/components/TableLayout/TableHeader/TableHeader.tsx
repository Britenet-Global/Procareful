import { Link } from 'react-router-dom';
import { Select, Checkbox, Input, type SelectProps } from 'antd';
import type {
  TableHeaderButtonProps,
  CheckboxProps,
  SearchProps,
  RedirectionProps,
} from '@ProcarefulAdmin/typings';
import { type Key, useTypedTranslation } from '@Procareful/common/lib';
import { Title, Text } from '@Procareful/ui';
import HeaderButton from './HeaderButton';
import { useStyles } from './styles';

type TableHeaderProps = {
  title: string;
  subtitle?: string;
  selectMenus?: SelectProps[];
  buttonMenu?: TableHeaderButtonProps;
  checkboxMenu?: CheckboxProps;
  searchMenu?: SearchProps;
  redirectionMenu?: RedirectionProps;
};

const TableHeader = ({
  title,
  subtitle,
  selectMenus,
  buttonMenu,
  checkboxMenu,
  searchMenu,
  redirectionMenu,
}: TableHeaderProps) => {
  const { styles, cx } = useStyles();
  const { t } = useTypedTranslation();
  const { Search } = Input;

  const renderSelect = () =>
    selectMenus?.map(selectMenu => {
      const { className, options, ...restDropdownProps } = selectMenu;

      return (
        <Select
          key={selectMenu.id}
          className={cx(styles.dropdownWithMargin, className)}
          options={options?.map(o => ({ ...o, label: t(o.label as Key) }))}
          {...restDropdownProps}
        />
      );
    });

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <div className={styles.row}>
          <Title level={5} className={styles.title}>
            {title}
          </Title>
          {redirectionMenu && (
            <Link to={redirectionMenu.linkTo} className={styles.redirectionTitle}>
              <Text>{redirectionMenu.title}</Text>
            </Link>
          )}
        </div>
        {subtitle && <Text className={styles.subtitle}>{subtitle}</Text>}
      </div>
      <div className={styles.actionContainer}>
        {checkboxMenu && (
          <Checkbox {...checkboxMenu} className={cx(styles.checkbox, checkboxMenu.className)}>
            {checkboxMenu.title}
          </Checkbox>
        )}
        {searchMenu && (
          <Search {...searchMenu} className={cx(styles.search, searchMenu.className)} />
        )}
        {renderSelect()}
        <HeaderButton buttonMenu={buttonMenu} />
      </div>
    </div>
  );
};

export default TableHeader;
