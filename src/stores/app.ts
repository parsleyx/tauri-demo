import { atom } from "recoil";
export const customerServiceUrlState = atom({
    key: "customerServiceUrlState",
    default: localStorage.getItem('customerServiceUrlState') || '',
    effects: [
        ({onSet}) => {
            onSet((value: string) => {
                localStorage.setItem('customerServiceUrlState', value);
            });
        }
    ]
});
export const downloadingState = atom({
    key: "downloadingState",
    default: false,
});