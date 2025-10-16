export interface PopupMessageProps {
  title: string;
  message: string;
  onClose?: () => void;
  duration?: number;
}
