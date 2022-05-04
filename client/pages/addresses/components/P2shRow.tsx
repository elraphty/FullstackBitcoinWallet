import { ChevronRightIcon } from '@heroicons/react/solid';

import { P2SHAdress } from '../../types';

interface Props {
  address: P2SHAdress;
}

export default function AddressRow({ address }: Props) {
  return (
    <li key={address.address}>
      <div className="group block">
        <div className="flex items-center py-5 px-4 sm:py-6 sm:px-2">
          <div className="min-w-0 flex-1 flex items-center">
            <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
              <div>
                <p className="text-sm font-medium text-yellow-600 truncate">
                  {address.address}
                </p>
              </div>
            </div>
          </div>
          <div>
            <ChevronRightIcon
              className="h-5 w-5 text-gray-400 group-hover:text-gray-700"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </li>
  );
}
