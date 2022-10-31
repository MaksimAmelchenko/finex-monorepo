import React, { useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';

import { Form, FormBody, FormButton, FormCheckbox, FormFooter, FormHeader, FormSelect } from '../../components/Form';
import { ISelectOption } from '@finex/ui-kit';
import { Permit, Shape } from '../../types';
import { Project } from '../../stores/models/project';
import { ProjectsRepository } from '../../stores/projects-repository';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

interface MergeProjectFormValues {
  projectId: string;
  projects: string[];
  isRiskAccepted: boolean;
}

interface ProjectMergeWindowProps {
  project?: Project | null;
  onClose: () => unknown;
}

const t = getT('ProjectMergeWindow');

export function ProjectMergeWindow({ project, onClose }: ProjectMergeWindowProps): JSX.Element {
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
    <Form<MergeProjectFormValues>
      onSubmit={onSubmit}
      initialValues={{
        projectId: initProject.id,
        projects: [],
        isRiskAccepted: false,
      }}
      validationSchema={validationSchema}
    >
      <FormHeader title={t('Merge projects')} onClose={onClose} />

      <FormBody>
        <FormSelect name="projectId" label={t('Target project')} options={selectProjectsOptions} />
        <FormSelect name="projects" label={t('Merged projects')} options={selectProjectsOptions} isMulti autoFocus />
        <FormCheckbox name="isRiskAccepted">
          {t(
            'I understand that the merged projects will be deleted after the data has been transferred to the target project'
          )}
        </FormCheckbox>
      </FormBody>

      <FormFooter>
        <FormButton variant="outlined" isIgnoreValidation onClick={onClose}>
          {t('Cancel')}
        </FormButton>
        <FormButton type="submit" color="primary" isIgnoreValidation>
          {t('Merge')}
        </FormButton>
      </FormFooter>
    </Form>
  );
}
