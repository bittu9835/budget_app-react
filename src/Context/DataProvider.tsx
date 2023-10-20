import { createContext, useState } from "react";


type DataContextValue = {
    render: boolean
    setRender: React.Dispatch<React.SetStateAction<boolean>>
    profileToggle:boolean
    setProfileToggle:React.Dispatch<React.SetStateAction<boolean>>
    theme:string
    setTheme:React.Dispatch<React.SetStateAction<string>>
    openFotm:boolean
    setOpenForm:React.Dispatch<React.SetStateAction<boolean>>
};

export const DataContext = createContext<DataContextValue>({} as DataContextValue);
type DataProviderProps = {
    children: React.ReactNode;
};

const DataProvider = ({ children }: DataProviderProps) => {
    const [render, setRender] = useState(false);
    const [profileToggle,setProfileToggle]=useState(false)
    const [openFotm,setOpenForm]=useState(false)
    const [theme,setTheme]=useState('')

    const value: DataContextValue = {
        render, setRender,
        profileToggle,setProfileToggle,
        theme,setTheme,
        openFotm,setOpenForm,
    };
    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
export default DataProvider;