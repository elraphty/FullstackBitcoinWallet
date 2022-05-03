import { CheckCircleIcon } from '@heroicons/react/solid';

interface Props {
    address: string;
}

const P2shSuccessAlert = ({ address }: Props) => {
    return (
        <div className="rounded-md bg-green-50 p-4 mt-4 border border-gray-200 shadow">
            <div className="flex">
                <div className="flex-shrink-0">
                    <CheckCircleIcon
                        className="h-5 w-5 text-green-400"
                        aria-hidden="true"
                    />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                        Your transaction has been broadcasted!
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                        <p>
                            Pay To Script Hash (P2SH) address created successfully.
                        </p>
                        <p>Address: {address}</p>
                    </div>
                    <div className="mt-4">
                        <div className="-mx-2 -my-1.5 flex">
                            <button className="inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2" onClick={() => navigator.clipboard.writeText(address)}>Copy address</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default P2shSuccessAlert;