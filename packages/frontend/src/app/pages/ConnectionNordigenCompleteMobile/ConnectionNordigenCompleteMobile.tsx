import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Button, LingBroken01Icon, RightLongIcon } from '@finex/ui-kit';
import { ConnectionsRepository } from '../../stores/connections-repository';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { Loader } from '../../components/Loader/Loader';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './ConnectionNordigenCompleteMobile.module.scss';

const t = getT('ConnectionNordigenCompleteMobile');

export const ConnectionNordigenCompleteMobile = observer(() => {
  const connectionsRepository = useStore(ConnectionsRepository);
  const [isError, setIsError] = useState(false);

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const requisitionId = searchParams.get('ref');
  const error = searchParams.get('error');

  useEffect(() => {
    if (requisitionId && !error) {
      connectionsRepository
        .completeNordigenRequisition(requisitionId)
        .then(({ connectionId }) => {
          navigate(`/settings/connections/${connectionId}`, { replace: true });
        })
        .catch(err => setIsError(true));
    }
  }, [connectionsRepository, error, navigate, requisitionId]);

  useEffect(() => {
    if (error) {
      navigate('/settings/connections', { replace: true });
    }
  }, [error, navigate]);

  if (isError) {
    return (
      <div className={styles.root__errorState}>
        <EmptyState
          illustration={<LingBroken01Icon className={styles.root__errorStateIllustration} />}
          text={t('Connection failed')}
          supportingText={t(
            'Something went wrong. Please try again. If the problem persists, please contact our support team'
          )}
        >
          <Button size="sm" href="/settings/connections" endIcon={<RightLongIcon />}>
            {t('Try again')}
          </Button>
        </EmptyState>
      </div>
    );
  }

  return <Loader />;
});

export default ConnectionNordigenCompleteMobile;
