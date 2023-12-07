import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Header() {
  return (
    <Disclosure as="nav" className="bg-white">
      {({ open }) => (
        <>
          <div className="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="flex items-center justify-center flex-1 sm:items-stretch sm:justify-start">
                <div className="flex items-center flex-shrink-0 space-x-2">
                  <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-red-600">
                    Illumineer
                  </h1>
                </div>
              </div>
            </div>
          </div>
          <div className='items-center'>
            <hr className="h-0.5 my-1 bg-gradient-to-br from-blue-400 to-red-600"/>
          </div>
        </>
      )}
    </Disclosure>
  )
}
