import * as React from 'react';

import type { SessionMetadata } from '@/src/shared/types/session-metadata.types';
import { Html } from '@react-email/html';
import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components';

interface DeactivateTemplateProps {
  token: string;
  metadata: SessionMetadata;
}

export function DeactivateTemplate({ token, metadata }: DeactivateTemplateProps) {
  const informationDataList = [
    {
      title: '🌎 Location',
      data: `${metadata.location.country}, ${metadata.location.city}`
    },
    { title: '📱 Operation System', data: metadata.device.os },
    { title: '🌐 Browser', data: metadata.device.browser },
    { title: '💻 IP address', data:  metadata.ip }
  ]

  return (
    <Html>
      <Head />

      <Preview>Account deactivation</Preview>

      <Tailwind>
        <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
          <Section className='text-center mb-8'>
            <Heading className='text-3xl text-black font-bold'>
              Deactivation account request
            </Heading>

            <Text className='text-base text-black mt-2'>
              You have initiated the process of deactivating your account on the <b>Twitch Clone</b> platform.
            </Text>
          </Section>

          <Section className='bg-gray-100 rounded-lg p-6 text-center mb-6'>
            <Heading className='text-2xl text-black font-semibold'>
              Verification code:
            </Heading>

            <Heading className='text-3xl text-black font-semibold'>
              {token}
            </Heading>

            <Text className='text-black'>
              This code will be valid for 5 minutes. 
            </Text>
          </Section>

          <Section className='bg-gray-100 rounded-lg p-6 mb-6'>
            <Heading className='text-xl font-semibold text-[#18b9ae]'>
              Information about request:
            </Heading>

            <ul className='list-desc list-inside text-black mt-2'>
              {informationDataList.map(({ title, data }) => <li>{title}: {data}</li>)}
            </ul>

            <Text className='text-gray-600 mt-2'>
              If you have not initialized this request, please ignore it.
            </Text>
          </Section>

          <Section className='text-center mt-8'>
            <Text className='text-gray-600'>
              If you have any questions or encounter difficulties, please don’t hesitate to contact our support team at {' '}
              <Link
                href='mailto:rostislavkpi@gmail.com'
                className='text-[#18b9ae] underline'>
                rostislavkpi@gmail.com
              </Link>.
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  )
}
