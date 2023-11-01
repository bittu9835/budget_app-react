import type { FC } from 'react';

interface SettingsProps { }

const Settings: FC<SettingsProps> = () => {
    return (
        <div className='bg-white flex w-full h-full items-center justify-center'>
            <p className='text-7xl font-bold text-purple-950 animate-bounce'>Comming Soon</p>
        </div>
    );
}

export default Settings;
