import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components'
import { Html } from '@react-email/html'
import * as React from 'react'

export function VerifyChannelTemplate() {
  return (
    <Html>
      <Head />

      <Preview>Your channel has been verified</Preview>

      <Tailwind>
        <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
          <Section className='text-center mb-8'>
            <Heading className='text-3xl text-black font-bold'>
              Congratulations! Your channel has been verified
            </Heading>

            <Text className='text-base text-black mt-2'>
              We are pleased to announce that your channel is now verified and you have received an official badge.
            </Text>
          </Section>

          <Section className="bg-white rounded-lg shadow-md p-6 text-center mb-6">
            <Heading className='text-2xl text-black font-semibold'>
              What does it mean?
            </Heading>

            <Text className='text-base text-black mt-2'>
              The verification badge confirms the authenticity of your channel and improves viewer trust.
            </Text>
          </Section>

          <Section className='text-center mt-8'>
            <Text className='text-gray-600'>
              If you have any questions, please contact support at {' '}
              <Link
                href='mailto:rostislavkpi@gmail.com'
                className='text-[#18b9ae] underline'
              >
                rostislavkpi@gmail.com
              </Link>.
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  )
}