import React, { useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';
import { useSnackbar } from 'notistack';

import { CreateProjectData, IProject, UpdateProjectChanges } from '../../types/project';
import {
  Form,
  FormBody,
  FormButton,
  FormFieldSet,
  FormFooter,
  FormHeader,
  FormSelect,
  FormTextAreaField,
  FormTextField,
} from '../../components/Form';
import { ISelectOption } from '@finex/ui-kit';
import { ProfileRepository } from '../../stores/profile-repository';
import { Project } from '../../stores/models/project';
import { ProjectsRepository } from '../../stores/projects-repository';
import { Shape } from '../../types';
import { UsersRepository } from '../../stores/users-repository';
import { getPatch } from '../../lib/core/get-patch';
import { getT } from '../../lib/core/i18n';
import { useCloseOnEscape } from '../../hooks/use-close-on-escape';
import { useStore } from '../../core/hooks/use-store';

interface ProjectFormValues {
  name: string;
  note: string;
  editors: string[];
}

interface ProjectWindowProps {
  project: Partial<IProject> | Project;
  onClose: () => unknown;
}

const t = getT('ProjectWindow');

function mapValuesToCreatePayload({ name, note, editors }: ProjectFormValues): CreateProjectData {
  return {
    name,
    note,
    editors,
  };
}

function mapValuesToUpdatePayload({ name, note, editors }: ProjectFormValues): UpdateProjectChanges {
  return {
    name,
    note,
    editors,
  };
}

export function ProjectWindow({ project, onClose }: ProjectWindowProps): JSX.Element {
  const projectsRepository = useStore(ProjectsRepository);
  const profileRepository = useStore(ProfileRepository);
  const usersRepository = useStore(UsersRepository);

  const { enqueueSnackbar } = useSnackbar();
  const { onCanCloseChange } = useCloseOnEscape({ onClose });

  const nameFieldRefCallback = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      node.focus();
    }
  }, []);

  const onSubmit = useCallback(
    (values: ProjectFormValues, _: FormikHelpers<ProjectFormValues>, initialValues: ProjectFormValues) => {
      let result: Promise<unknown>;
      if (project instanceof Project) {
        const changes: UpdateProjectChanges = getPatch(
          mapValuesToUpdatePayload(initialValues),
          mapValuesToUpdatePayload(values)
        );
        result = projectsRepository.updateProject(project, changes);
      } else {
        const data: CreateProjectData = mapValuesToCreatePayload(values);
        result = projectsRepository.createProject(data);
      }

      return result
        .then(() => {
          onClose();
        })
        .catch(err => {
          let message = '';
          switch (err.code) {
            case 'project_id_user_name_u':
              message = t('That name is taken. Try another.');
              break;
            default:
              message = err.message;
          }
          enqueueSnackbar(message, { variant: 'error' });
        });
    },
    [project, projectsRepository, enqueueSnackbar, onClose]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object<Shape<ProjectFormValues>>({
        name: Yup.string().required(t('Enter a project name')),
      }),
    []
  );

  const selectUsersOptions = useMemo<ISelectOption[]>(() => {
    return usersRepository.users
      .filter(({ id }) => id !== profileRepository.profile!.user.id)
      .map(({ id: value, name: label }) => ({ value, label }));
  }, [profileRepository.profile, usersRepository.users]);

  const { name, note, editors } = project;

  const isEdit = project instanceof Project;
  return (
    <Form<ProjectFormValues>
      onSubmit={onSubmit}
      initialValues={{
        name: name ?? '',
        note: note ?? '',
        editors: editors?.map(({ id }) => id) ?? [],
      }}
      validationSchema={validationSchema}
      onDirtyChange={dirty => onCanCloseChange(!dirty)}
    >
      <FormHeader title={isEdit ? t('Edit project') : t('New project')} onClose={onClose} />

      <FormBody>
        <FormTextField name="name" label={t('Project name')} ref={nameFieldRefCallback} />
        <FormTextAreaField name="note" label={t('Project description (optional)')} />
        <FormFieldSet legend={t('Permissions')}>
          <FormSelect
            name="editors"
            isMulti
            label={t('Editors')}
            options={selectUsersOptions}
            helperText={t('List of users who have the right to add, edit and delete transactions on this project')}
          />
        </FormFieldSet>
      </FormBody>

      <FormFooter>
        <FormButton variant="outlined" isIgnoreValidation onClick={onClose}>
          {t('Cancel')}
        </FormButton>
        <FormButton type="submit" color="primary" isIgnoreValidation>
          {isEdit ? t('Save') : t('Create project')}
        </FormButton>
      </FormFooter>
    </Form>
  );
}
