import { Html } from '@react-email/html';
import * as React from 'react';
import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components';

import type { SessionMetadata } from '@/src/shared/types/session-metadata.types';

interface PasswordRecoveryTemplateProps {
  domain: string;
  token: string;
  metadata: SessionMetadata;
}

export function PasswordRecoveryTemplate({
  domain,
  token,
  metadata,
}: PasswordRecoveryTemplateProps) {
  const resetLink = `${domain}/account/recovery/${token}`;

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

      <Preview>Account verification</Preview>

      <Tailwind>
        <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
          <Section className='text-center mb-8'>
            <Heading className='text-3xl text-black font-bold'>
              Password reset
            </Heading>

            <Text className='text-base text-black mt-2'>
              You have requested a password reset for your account. 
            </Text>

            <Text className='text-base text-black mt-2'>
              To create a new password, please follow the link below:
            </Text>

            <Link
              href={resetLink}
              className='inline-flex justify-center items-center rounded-full text-sm font-medium text-white bg-[#18b9ae] px-5 py-2'>
              Reset password
            </Link>
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
