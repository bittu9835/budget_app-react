import type { FC } from 'react';

interface LoaderProps {
    isLoading: boolean
}

const Loader: FC<LoaderProps> = ({ isLoading }) => {
    return (
        <>
            {isLoading
                ?
                <div className='w-full h-full flex items-center justify-center bg-skin-loader-bg inset-0 fixed top-16 sm:top-0 sm:absolute z-50 ">'>
                    < div className="w-16 h-16  border-t-2  border-r-0 border-b-0 border-skin-loader-border border-solid rounded-full animate-spin" >
                    </div >
                </div >
                :
                ''
            }
        </>
    );
}

export default Loader;
