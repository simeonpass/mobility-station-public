export function FieldError({
  id,
  message,
}: {
  id: string;
  message?: string | null;
}) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1 text-xs text-error">
      {message}
    </p>
  );
}

export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" aria-live="polite" className="text-sm text-error">
      {message}
    </p>
  );
}

export function fieldValidity(errorId: string, message?: string | null) {
  return {
    "aria-invalid": Boolean(message) || undefined,
    "aria-describedby": message ? errorId : undefined,
  };
}
