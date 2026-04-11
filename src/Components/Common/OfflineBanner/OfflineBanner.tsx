import { FC } from 'react';
import { MdWifiOff, MdSync } from 'react-icons/md';

interface OfflineBannerProps {
    isOnline: boolean;
    isSyncing: boolean;
}

const OfflineBanner: FC<OfflineBannerProps> = ({ isOnline, isSyncing }) => {
    if (isOnline && !isSyncing) return null;

    return (
        <div
            className={`w-full flex items-center justify-center gap-2 text-xs sm:text-sm font-medium py-1.5 px-3 transition-all duration-300 z-50 ${
                !isOnline
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
            }`}
        >
            {!isOnline ? (
                <>
                    <MdWifiOff className="text-base sm:text-lg animate-pulse" />
                    <span>You're offline — changes are saved locally</span>
                </>
            ) : isSyncing ? (
                <>
                    <MdSync className="text-base sm:text-lg animate-spin" />
                    <span>Syncing your data...</span>
                </>
            ) : null}
        </div>
    );
};

export default OfflineBanner;
