import { ArrowForwardIcon, Option } from '@finex/ui-kit';

import styles from './Target.module.scss';

export interface TargetProps {
  label: string;
  onClick: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export function Target({ label, onClick }: TargetProps): JSX.Element {
  return (
    <div className={styles.target} onClick={onClick}>
      <Option label={label} onClick={noop} />
      <ArrowForwardIcon className={styles.target__icon} />
    </div>
  );
}
