import { toast as sonnerToast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

// Track active toasts to prevent duplicates
const activeToasts = new Set<string>();

export function useToast() {
  const { t } = useLanguage();

  const showToast = (
    type: 'success' | 'error' | 'warning' | 'info',
    messageKey: string,
    options?: {
      description?: string;
      duration?: number;
      id?: string;
    }
  ) => {
    const message = t(messageKey, messageKey);
    const description = options?.description ? t(options.description, options.description) : undefined;
    const id = options?.id || `${type}-${messageKey}`;

    // Prevent duplicate toasts
    if (activeToasts.has(id)) {
      return;
    }

    activeToasts.add(id);

    const toastOptions = {
      id,
      duration: options?.duration ?? 4000,
      onDismiss: () => activeToasts.delete(id),
      ...(description && { description }),
    };

    switch (type) {
      case 'success':
        sonnerToast.success(message, toastOptions);
        break;
      case 'error':
        sonnerToast.error(message, toastOptions);
        break;
      case 'warning':
        sonnerToast.warning(message, toastOptions);
        break;
      case 'info':
        sonnerToast(message, toastOptions);
        break;
    }
  };

  return { showToast };
}

// For non-hook usage, but since it needs context, better to use hook
export { toast } from 'sonner';
