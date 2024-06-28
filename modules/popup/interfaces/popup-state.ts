import { ReactElement } from "react";

export interface PopupState {
    isOpen: boolean;
    title: string;
    content: string | ReactElement;
    buttons: { text: string; onClick: () => void; color: string }[];
}