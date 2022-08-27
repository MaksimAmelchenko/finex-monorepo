import React, { useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';
import { useSnackbar } from 'notistack';

import { CreateTagData, ITag, UpdateTagChanges } from '../../types/tag';
import { Form, FormBody, FormButton, FormFooter, FormHeader, FormTextField } from '../../components/Form';
import { Shape } from '../../types';
import { Tag } from '../../stores/models/tag';
import { TagsRepository } from '../../stores/tags-repository';
import { getPatch } from '../../lib/core/get-path';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

interface TagFormValues {
  name: string;
}

interface TagWindowProps {
  tag: Partial<ITag> | Tag;
  onClose: () => unknown;
}

const t = getT('TagWindow');

function mapValuesToPayload({ name }: TagFormValues): CreateTagData {
  return {
    name,
  };
}
export function TagWindow({ tag, onClose }: TagWindowProps): JSX.Element {
  const tagsRepository = useStore(TagsRepository);
  const { enqueueSnackbar } = useSnackbar();

  const nameFieldRefCallback = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      node.focus();
    }
  }, []);

  const onSubmit = useCallback(
    (values: TagFormValues, _: FormikHelpers<TagFormValues>, initialValues: TagFormValues) => {
      let result: Promise<unknown>;
      if (tag instanceof Tag) {
        const changes: UpdateTagChanges = getPatch(mapValuesToPayload(initialValues), mapValuesToPayload(values));
        result = tagsRepository.updateTag(tag, changes);
      } else {
        const data: CreateTagData = mapValuesToPayload(values);
        result = tagsRepository.createTag(data);
      }

      return result
        .then(() => {
          onClose();
        })
        .catch(err => {
          let message = '';
          switch (err.code) {
            case 'tag_id_project_name_u':
              message = t('Tag already exists');
              break;
            default:
              message = err.message;
          }
          enqueueSnackbar(message, { variant: 'error' });
        });
    },
    [enqueueSnackbar, onClose, tag, tagsRepository]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object<Shape<TagFormValues>>({
        name: Yup.string().required('Please fill name'),
      }),
    []
  );

  const { name } = tag;

  return (
    <Form<TagFormValues>
      onSubmit={onSubmit}
      initialValues={{
        name: name ?? '',
      }}
      validationSchema={validationSchema}
    >
      <FormHeader title={tag instanceof Tag ? t('Add new tag') : t('Edit tag')} onClose={onClose} />

      <FormBody>
        <FormTextField name="name" label={t('Name')} ref={nameFieldRefCallback} />
      </FormBody>

      <FormFooter>
        <FormButton variant="outlined" isIgnoreValidation onClick={onClose}>
          {t('Cancel')}
        </FormButton>
        <FormButton type="submit" color="secondary" isIgnoreValidation>
          {t('Save')}
        </FormButton>
      </FormFooter>
    </Form>
  );
}
