'use client';

import { Modal } from '@/components/ui/Modal';
import { EntryForm } from '@/components/EntryForm';

type EntryFormModalProps = { open: boolean; title: string; onClose: () => void } & Omit<Parameters<typeof EntryForm>[0], 'onCancel'>;

/** EntryForm in a dialog. The form unmounts when closed, so it always opens fresh. */
export function EntryFormModal({ open, title, onClose, ...formProps }: EntryFormModalProps) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <EntryForm {...formProps} onCancel={onClose} />
    </Modal>
  );
}