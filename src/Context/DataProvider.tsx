import { createContext, useState } from "react";


type DataContextValue = {
    render: boolean
    setRender: React.Dispatch<React.SetStateAction<boolean>>
    profileToggle: boolean
    setProfileToggle: React.Dispatch<React.SetStateAction<boolean>>
    theme: string
    setTheme: React.Dispatch<React.SetStateAction<string>>
    openFotm: boolean
    setOpenForm: React.Dispatch<React.SetStateAction<boolean>>
    transactionForEdit: any | null
    settransactionForEdit: React.Dispatch<React.SetStateAction<any | null>>
    selectedTransaction: any[]
    setSelectedTransaction: React.Dispatch<React.SetStateAction<any[]>>
    accountForEdit: any | null
    setAccountForEdit: React.Dispatch<React.SetStateAction<any | null>>
    filterData: any
    setfilterData: React.Dispatch<React.SetStateAction<any>>
};

export const DataContext = createContext<DataContextValue>({} as DataContextValue);
type DataProviderProps = {
    children: React.ReactNode;
};

const DataProvider = ({ children }: DataProviderProps) => {
    const [render, setRender] = useState(false);
    const [profileToggle, setProfileToggle] = useState(false)
    const [filterData, setfilterData] = useState('')
    const [openFotm, setOpenForm] = useState(false)
    const [theme, setTheme] = useState('')
    const [transactionForEdit, settransactionForEdit] = useState<any | null>(null)
    const [accountForEdit, setAccountForEdit] = useState<any | null>(null)
    const [selectedTransaction, setSelectedTransaction] = useState<any[]>([])

    const value: DataContextValue = {
        render, setRender,
        profileToggle, setProfileToggle,
        theme, setTheme,
        openFotm, setOpenForm,
        transactionForEdit, settransactionForEdit,
        selectedTransaction, setSelectedTransaction,
        accountForEdit, setAccountForEdit,
        filterData, setfilterData
    };
    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
export default DataProvider;