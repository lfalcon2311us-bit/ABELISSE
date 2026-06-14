type ErrorContext = {
  file: string;
  functionName?: string;
  route?: string;
  requestUrl?: string;
  requestMethod?: string;
  extra?: Record<string, any>;
};

export async function reportErrorToBackend(
  message: string,
  error: any,
  context: ErrorContext
) {
  const payload = {
    message,
    error: error?.stack || String(error),
    context,
    timestamp: new Date().toISOString(),
  };

  try {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/error-report/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error('Error enviando reporte de error:', e);
  }
}
