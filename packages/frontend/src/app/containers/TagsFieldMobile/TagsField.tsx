import React, { useCallback, useMemo, useState } from 'react';
import { useField, useFormikContext } from 'formik';

import { IOption, LabelInput } from '@finex/ui-kit';
import { Tag } from '../../stores/models/tag';
import { TagsMobile } from '../TagsMobile/TagsMobile';
import { TagsRepository } from '../../stores/tags-repository';
import { useStore } from '../../core/hooks/use-store';

export interface LabelInputFieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  name: string;
  label?: string;
  size?: 'sm';
  helperText?: string;
  className?: string;
}

export function TagsField({ name, ...rest }: LabelInputFieldProps): JSX.Element {
  const tagsRepository = useStore(TagsRepository);

  const [openTags, setOpenTags] = useState<boolean>(false);

  const { setFieldValue, setFieldTouched } = useFormikContext<any>();
  const [{ value: tagIds }] = useField<string[]>(name);

  const options = useMemo(() => {
    return tagIds.reduce<IOption[]>((acc, tagId) => {
      const tag = tagsRepository.get(tagId);
      if (tag) {
        acc.push({ value: tag.id, label: tag.name });
      }
      return acc;
    }, []);
  }, [tagIds]);

  const handleTagsDropdownClick = useCallback(() => {
    setOpenTags(true);
  }, []);

  const handleTagSelect = useCallback(
    (tag: Tag) => {
      setFieldValue(name, Array.from(new Set([...tagIds, tag.id])));
      setFieldTouched(name, true, false);
      setOpenTags(false);
    },
    [tagIds]
  );

  const handleTagsClose = useCallback(() => {
    setOpenTags(false);
  }, []);

  const handleTagClick = ({ value }: IOption) => {
    setFieldValue(
      name,
      tagIds.filter(tagId => tagId !== value)
    );
    setFieldTouched(name, true, false);
  };

  return (
    <>
      <LabelInput {...rest} onClick={handleTagsDropdownClick} onTagClick={handleTagClick} options={options} />
      <TagsMobile open={openTags} onSelect={handleTagSelect} onClose={handleTagsClose} />
    </>
  );
}
