import type { ISignatureLoadingProps } from '@/components/SignatureLoadingModal';

const SHOW_SIGNATURE = 'SHOW_SIGNATURE';
const CLOSE = 'CLOSE';

export type IActionTypes = typeof SHOW_SIGNATURE | typeof CLOSE;

export type IModalProps = ISignatureLoadingProps;

export interface IAction {
  type: IActionTypes;
  payload: IModalProps;
}

export interface ILoadingScreenState {
  isVisible: boolean;
  modal: LoadingScreenModal | null;
  modalProps: IModalProps | null;
}

export enum LoadingScreenModal {
  Signature = 'Signature',
}
const reducer = (
  state: ILoadingScreenState,
  action: IAction
): ILoadingScreenState => {
  switch (action.type) {
    case SHOW_SIGNATURE:
      return {
        ...state,
        isVisible: true,
        modal: LoadingScreenModal.Signature,
        modalProps: action.payload,
      };
    case CLOSE:
      return {
        ...state,
        isVisible: false,
        modal: null,
        modalProps: null,
      };
    default:
      return state;
  }
};

export default reducer;
