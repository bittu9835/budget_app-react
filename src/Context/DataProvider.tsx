import { createContext, useState } from "react";


type DataContextValue = {
    render: boolean
    setRender: React.Dispatch<React.SetStateAction<boolean>>
};

export const DataContext = createContext<DataContextValue>({} as DataContextValue);
type DataProviderProps = {
    children: React.ReactNode;
};

const DataProvider = ({ children }: DataProviderProps) => {
    const [render, setRender] = useState(false);

    const value: DataContextValue = {
        render, setRender
    };
    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
export default DataProvider;