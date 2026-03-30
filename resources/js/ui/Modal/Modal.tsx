import { motion } from 'framer-motion'
import React from 'react'
import styles from './Modal.module.css'

interface Properties {
  children?: React.ReactNode
  setShowModal: (value: boolean) => unknown
  title?: string
  large?: boolean
  showClosButton?: boolean
}

export default function Modal({
  children,
  setShowModal,
  title,
  large = false,
  showClosButton = true,
}: Properties) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={styles.modal}
    >
      <div className='relative h-screen w-screen'>
        <div
          className='fixed inset-0 z-40 bg-black/50 dark:bg-black/70'
          onClick={() => setShowModal(false)}
        />
        <div className='fixed inset-0 z-50 flex items-start justify-center pt-20'>
          <div
            className={
              'w-11/12 rounded-lg border border-gray-200 bg-white shadow-lg md:w-2/3 dark:border-gray-700 dark:bg-gray-900 ' +
              (large ? '' : 'max-w-lg')
            }
          >
            <div className='flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700'>
              <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>{title}</h2>
              {showClosButton && (
                <button
                  onClick={() => setShowModal(false)}
                  className='rounded p-1 text-gray-600 transition hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              )}
            </div>
            <div className='max-h-[80vh] overflow-y-auto p-4'>{children}</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
