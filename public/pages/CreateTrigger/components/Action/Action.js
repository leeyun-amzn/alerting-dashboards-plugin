/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import _ from 'lodash';
import {
  EuiAccordion,
  EuiButton,
  EuiHorizontalRule,
  EuiPanel,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';
import { FormikFieldText, FormikComboBox } from '../../../../components/FormControls';
import { isInvalid, hasError, validateActionName } from '../../../../utils/validate';
import { ActionsMap } from './utils/constants';
import { validateDestination } from './utils/validate';
import { DEFAULT_ACTION_TYPE } from '../../utils/constants';

const Action = ({
  action,
  arrayHelpers,
  context,
  destinations,
  index,
  onDelete,
  sendTestMessage,
  setFlyout,
  fieldPath,
  values,
}) => {
  const selectedDestination = destinations.filter((item) => item.value === action.destination_id);
  const type = _.get(selectedDestination, '0.type', DEFAULT_ACTION_TYPE);
  const { name } = action;
  const ActionComponent = ActionsMap[type].component;
  const actionLabel = ActionsMap[type].label;
  const isFirstAction = index !== undefined && index === 0;
  return (
    <div style={{ paddingTop: isFirstAction ? undefined : '20px' }}>
      <EuiPanel styles={{ backgroundColor: '#FFFFFF' }}>
        <EuiAccordion
          id={name}
          initialIsOpen={!name}
          className="accordion-action"
          buttonContent={
            <EuiText>
              {!_.get(selectedDestination, '0.type', undefined)
                ? 'Notification'
                : `${actionLabel}: ${name}`}
            </EuiText>
          }
          extraAction={
            <EuiButton color={'danger'} onClick={onDelete} size={'s'}>
              Remove action
            </EuiButton>
          }
          paddingSize={'s'}
        >
          <EuiHorizontalRule margin="s" />
          <div style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '10px' }}>
            <FormikFieldText
              name={`${fieldPath}actions.${index}.name`}
              formRow
              fieldProps={{
                validate: validateActionName(context.ctx.monitor, context.ctx.trigger),
              }}
              rowProps={{
                label: 'Action name',
                helpText: 'Names can only contain letters, numbers, and special characters',
                isInvalid,
                error: hasError,
              }}
              inputProps={{
                placeholder: 'Enter action name',
                isInvalid,
              }}
            />
            <FormikComboBox
              name={`${fieldPath}actions.${index}.destination_id`}
              formRow
              fieldProps={{ validate: validateDestination(destinations) }}
              rowProps={{
                label: 'Destination',
                isInvalid,
                error: hasError,
              }}
              inputProps={{
                placeholder: 'Select a destination',
                options: destinations,
                selectedOptions: selectedDestination,
                onChange: (options) => {
                  // Just a swap correct fields.
                  arrayHelpers.replace(index, {
                    ...action,
                    destination_id: options[0].value,
                  });
                },
                onBlur: (e, field, form) => {
                  form.setFieldTouched(`${fieldPath}actions.${index}.destination_id`, true);
                },
                singleSelection: { asPlainText: true },
                isClearable: false,
              }}
            />
            <EuiSpacer size="m" />
            <ActionComponent
              action={action}
              context={context}
              index={index}
              sendTestMessage={sendTestMessage}
              setFlyout={setFlyout}
              fieldPath={fieldPath}
              values={values}
            />
          </div>
        </EuiAccordion>
      </EuiPanel>
    </div>
  );
};

export default Action;
