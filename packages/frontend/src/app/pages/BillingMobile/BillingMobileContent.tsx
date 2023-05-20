import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { BackButton, Header } from '../../components/Header/Header';
import { BillingContent } from '../../containers/BillingContent/BillingContent';
import { SideSheetBody } from '../../components/SideSheetMobile/SideSheetBody/SideSheetBody';
import { analytics } from '../../lib/analytics';
import { getT } from '../../lib/core/i18n';

const t = getT('Billing');

export interface BillingMobileContentProps {
  onClose: () => void;
}

export const BillingMobileContent = observer<BillingMobileContentProps>(({ onClose }) => {
  useEffect(() => {
    analytics.view({
      page_title: 'billing-mobile',
    });
  }, []);

  return (
    <>
      <Header title={t('Billing settings')} startAdornment={<BackButton onClick={onClose} />} />
      <SideSheetBody>
        <BillingContent />
      </SideSheetBody>
    </>
  );
});

export default BillingMobileContent;
