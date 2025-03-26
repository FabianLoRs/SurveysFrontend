import { createContext, Dispatch, FC, ReactNode, useContext, useReducer} from "react";
import { Poll } from "../types";
import { pollInitialState, PollReducer } from "../state/reducers/pollReducer";
import { PollActions } from "../state/actions/pollActions";

export const PollStateContext = createContext<Poll>(pollInitialState);
export const PollDispatchContext = createContext<Dispatch<PollActions>>(() => undefined);

interface PollProvideProps {
    children: ReactNode
};

export const PollProvider:FC<PollProvideProps> = ({ children }) => {
    const [poll, dispatch] = useReducer(PollReducer, pollInitialState);

    return (
        <PollStateContext.Provider value={ poll }>
            <PollDispatchContext.Provider value={ dispatch }>
                { children }
            </PollDispatchContext.Provider>
        </PollStateContext.Provider>
    );
};

export const usePollState = () => {
    const context = useContext(PollStateContext);

    if (context === undefined) {
        throw new Error("usePollAuthState, must be used within a PollProvider");
    }

    return context;
}

export const usePollDispatch = () => {
    const context = useContext(PollDispatchContext);

    if (context === undefined) {
        throw new Error("usePollAuthDispatch, must be used within a PollProvider");
    }
    
    return context;
}