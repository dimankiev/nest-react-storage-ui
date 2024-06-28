import { PopupState } from "@modules/popup/interfaces";

export const itemMovePopup = (
    setPopupState: (popupState: PopupState) => void,
    popupState: PopupState,
    draggedItemName: string,
    targetName: string,
    success: boolean
): void => {
    setPopupState({
        isOpen: true,
        title: success && "Success" || "Failed",
        content: success && `Moved ${draggedItemName} to ${targetName}` || "Failed to move.",
        buttons: [
            {
                text: "OK",
                onClick: () => setPopupState({ ...popupState, isOpen: false }),
                color: success && "bg-blue-500" || "bg-red-500"
            }],
    })
}