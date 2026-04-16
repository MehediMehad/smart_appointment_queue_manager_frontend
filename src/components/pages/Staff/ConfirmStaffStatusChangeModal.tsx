"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ConfirmModalState = {
  isOpen: boolean;
  staffId: string | null;
  currentStatus: "Available" | "OnLeave" | null;
};

interface Props {
  modalState: ConfirmModalState;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmStaffStatusChangeModal = ({
  modalState,
  onClose,
  onConfirm,
}: Props) => {
  const newStatus =
    modalState.currentStatus === "Available" ? "OnLeave" : "Available";

  return (
    <AlertDialog open={modalState.isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change Staff Status</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to change the status to{" "}
            <strong>{newStatus}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmStaffStatusChangeModal;
