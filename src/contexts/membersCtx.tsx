import { useState, createContext} from 'react';

type memberType = {Name: string, Picture: string}[];

type membersContextType = {
    members: memberType,
    setMembers: (members: memberType) => void;
}

export const membersCtx = createContext<membersContextType | null>(null);


export const MembersProvider = ({ children }: { children: React.ReactNode }) => {
const [members, setMembers] = useState<memberType>([]);
    return (
        <membersCtx.Provider value={{ members, setMembers }}>  
            {children}
        </membersCtx.Provider>
    );
}