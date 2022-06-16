import React, { useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';

import { Drawer } from '../../components/Drawer/Drawer';
import { DrawerFooter } from '../../components/Drawer/DrawerFooter';
import { Form, FormButton, FormCheckbox, FormLayout } from '../../components/Form';
import { FormSelect } from '../../components/Form/FormSelect/FormSelect';
import { ISelectOption } from '@finex/ui-kit';
import { Project } from '../../stores/models/project';
import { ProjectsRepository } from '../../stores/projects-repository';
import { Permit, Shape } from '../../types';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import styles from './ProjectMergeWindow.module.scss';

interface MergeProjectFormValues {
  projectId: string;
  projects: string[];
  isRiskAccepted: boolean;
}

interface ProjectMergeWindowProps {
  isOpened: boolean;
  project?: Project | null;
  onClose: () => unknown;
}

const t = getT('ProjectMergeWindow');

export function ProjectMergeWindow({ isOpened, project, onClose }: ProjectMergeWindowProps): JSX.Element {
  const projectsRepository = useStore(ProjectsRepository);
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = useCallback(
    ({ projectId, projects }: MergeProjectFormValues) => {
      return projectsRepository
        .mergeProject(projectId, { projects })
        .then(() => projectsRepository.getProjects())
        .then(() => onClose())
        .catch(err => {
          let message = '';
          switch (err.code) {
            default:
              message = err.message;
          }
          enqueueSnackbar(message, { variant: 'error' });
        });
    },
    [projectsRepository, enqueueSnackbar, onClose]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object<Shape<MergeProjectFormValues>>({
        projects: Yup.mixed().test('projects', t('Please select at least one project'), value => value.length > 0),
        isRiskAccepted: Yup.boolean().oneOf([true], t('You must accept this')),
      }),
    []
  );

  const selectProjectsOptions = useMemo<ISelectOption[]>(() => {
    return projectsRepository.projects
      .filter(({ permit }) => permit === Permit.Owner)
      .map(({ id: value, name: label }) => ({ value, label }));
  }, [projectsRepository.projects]);

  const initProject = project || projectsRepository.projects[0];

  return (
    <Drawer isOpened={isOpened} title={t('Merge projects')} onClose={onClose}>
      <Form<MergeProjectFormValues>
        onSubmit={onSubmit}
        initialValues={{
          projectId: initProject.id,
          projects: [],
          isRiskAccepted: false,
        }}
        validationSchema={validationSchema}
        className={styles.form}
      >
        <div className={styles.form__bodyWrapper}>
          <FormLayout className={styles.form__body}>
            <FormSelect name="projectId" label={t('Target project')} options={selectProjectsOptions} />
            <FormSelect name="projects" label={t('Merged projects')} options={selectProjectsOptions} isMulti />
            <FormCheckbox
              name="isRiskAccepted"
              label={t(
                'I understand that the merged projects will be deleted after the data has been transferred to the target project'
              )}
            />
          </FormLayout>
        </div>

        <DrawerFooter className={styles.footer}>
          <FormButton variant="outlined" isIgnoreValidation onClick={onClose}>
            {t('Cancel')}
          </FormButton>
          <FormButton type="submit" color="secondary" isIgnoreValidation>
            {t('Merge')}
          </FormButton>
        </DrawerFooter>
      </Form>
    </Drawer>
  );
}
