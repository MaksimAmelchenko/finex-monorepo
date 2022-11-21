import React, { useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import { observer } from 'mobx-react-lite';

import { Form, FormButton, FormLayout, FormSelect, FormTextField } from '../../../components/Form';
import { IProfile, UpdateProfileChanges } from '../../../types/profile';
import { ISelectOption } from '@finex/ui-kit';
import { Permit, Shape } from '../../../types';
import { ProfileRepository } from '../../../stores/profile-repository';
import { ProjectsRepository } from '../../../stores/projects-repository';
import { getPatch } from '../../../lib/core/get-patch';
import { getT } from '../../../lib/core/i18n';
import { useStore } from '../../../core/hooks/use-store';

import styles from '../Profile.module.scss';

interface IFormValues {
  name: string;
  email: string;
  projectId: string | null;
}

interface MainSettingsProps {
  profile: IProfile;
}

const t = getT('Profile');

export const MainSettings = observer(({ profile }: MainSettingsProps) => {
  const projectsRepository = useStore(ProjectsRepository);
  const profileRepository = useStore(ProfileRepository);

  const { name, email, timeout, project } = profile;

  const selectProjectsOptions = useMemo<ISelectOption[]>(() => {
    return projectsRepository.projects
      .filter(({ permit }) => permit === Permit.Owner)
      .map(({ id: value, name: label }) => ({ value, label }));
  }, [projectsRepository.projects]);

  const onSubmit = useCallback(
    ({ name, projectId }: IFormValues) => {
      if (!profile) {
        return;
      }
      const changes: UpdateProfileChanges = getPatch(
        { name: profile.name, projectId: profile.project?.id },
        { name, projectId }
      );

      return profileRepository.updateProfile(changes);
    },
    [profileRepository, profile]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object<Shape<IFormValues>>({
        name: Yup.string().required(t('Please enter name')),
      }),
    []
  );

  return (
    <div className={styles.section}>
      <div className={styles.section__sidebar}>
        <h2 className={styles.section__title}>{t('Main settings')}</h2>
      </div>

      <div className={styles.section__content}>
        <Form<IFormValues>
          onSubmit={onSubmit}
          initialValues={{ name, email, projectId: project?.id ?? null }}
          validationSchema={validationSchema}
          name="main-settings"
        >
          <FormLayout>
            <FormTextField name="email" type="email" label={t('E-mail')} readOnly disabled />

            <FormTextField name="name" type="text" label={t('Name')} />

            <FormSelect name="projectId" label={t('Project by default')} options={selectProjectsOptions} />
          </FormLayout>

          <footer className={styles.form__footer}>
            <FormButton type="submit" size="small" color="primary">
              {t('Update profile settings')}
            </FormButton>
          </footer>
        </Form>
      </div>
    </div>
  );
});
