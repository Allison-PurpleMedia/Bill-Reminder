import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

import CardBox from '../../components/CardBox';
import LayoutAuthenticated from '../../layouts/Authenticated';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import { getPageTitle } from '../../config';

import { Field, Form, Formik } from 'formik';
import FormField from '../../components/FormField';
import BaseDivider from '../../components/BaseDivider';
import BaseButtons from '../../components/BaseButtons';
import BaseButton from '../../components/BaseButton';
import FormCheckRadio from '../../components/FormCheckRadio';
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup';
import FormFilePicker from '../../components/FormFilePicker';
import FormImagePicker from '../../components/FormImagePicker';
import { SelectField } from '../../components/SelectField';
import { SelectFieldMany } from '../../components/SelectFieldMany';
import { SwitchField } from '../../components/SwitchField';
import { RichTextField } from '../../components/RichTextField';

import { update, fetch } from '../../stores/reminders/remindersSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditReminders = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    reminder_date: new Date(),

    message: '',

    bill: '',

    organization: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { reminders } = useAppSelector((state) => state.reminders);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { remindersId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: remindersId }));
  }, [remindersId]);

  useEffect(() => {
    if (typeof reminders === 'object') {
      setInitialValues(reminders);
    }
  }, [reminders]);

  useEffect(() => {
    if (typeof reminders === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = reminders[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [reminders]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: remindersId, data }));
    await router.push('/reminders/reminders-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit reminders')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit reminders'}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label='ReminderDate'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.reminder_date
                      ? new Date(
                          dayjs(initialValues.reminder_date).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({ ...initialValues, reminder_date: date })
                  }
                />
              </FormField>

              <FormField label='Message' hasTextareaHeight>
                <Field name='message' as='textarea' placeholder='Message' />
              </FormField>

              <FormField label='Bill' labelFor='bill'>
                <Field
                  name='bill'
                  id='bill'
                  component={SelectField}
                  options={initialValues.bill}
                  itemRef={'bills'}
                  showField={'bill_name'}
                ></Field>
              </FormField>

              {hasPermission(currentUser, 'READ_ORGANIZATIONS') && (
                <FormField label='organization' labelFor='organization'>
                  <Field
                    name='organization'
                    id='organization'
                    component={SelectField}
                    options={initialValues.organization}
                    itemRef={'organizations'}
                    showField={'name'}
                  ></Field>
                </FormField>
              )}

              <BaseDivider />
              <BaseButtons>
                <BaseButton type='submit' color='info' label='Submit' />
                <BaseButton type='reset' color='info' outline label='Reset' />
                <BaseButton
                  type='reset'
                  color='danger'
                  outline
                  label='Cancel'
                  onClick={() => router.push('/reminders/reminders-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditReminders.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_REMINDERS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditReminders;
