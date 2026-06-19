"use client";

import React from "react";
import { reportErrorToBackend } from "@/lib/logger";

interface ErrorBoundaryState {
  hasError: boolean;
  errorReported: boolean;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, errorReported: false };
  }

  async componentDidCatch(error: any, info: any) {
    // Evita loops infinitos y reportes duplicados
    if (!this.state.errorReported) {
      this.setState({ hasError: true, errorReported: true });

      try {
        await reportErrorToBackend("Error de renderizado en React", error, {
          file: "components/ErrorBoundary.tsx",
          functionName: "componentDidCatch",
          extra: { info },
        });
      } catch (e) {
        console.error("Error report no enviado:", e);
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-center">
          <h1 className="text-2xl font-bold">Ha ocurrido un error</h1>
          <p className="text-gray-500 mt-4">
            Estamos trabajando para solucionarlo.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
