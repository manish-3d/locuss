"use client";

import React, { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Simple error boundary for the 3D model loader.
 * Shows a development-friendly error message when the GLB fails to load.
 */
export class ModelErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#faf7f2] p-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e5ddd0] bg-white shadow-xs">
            <AlertTriangle className="h-6 w-6 text-[#b8924a]" />
          </div>
          <div>
            <p className="font-serif text-base font-semibold text-[#1e1b17]">
              Model Load Failed
            </p>
            <p className="mt-1 max-w-sm text-xs text-[#7a7268] leading-relaxed">
              The 3D property model could not be loaded. Ensure{" "}
              <code className="rounded bg-[#f2ece0] px-1 py-0.5 text-[#1e1b17]">
                public/models/modern_coastal_hillside_villa.glb
              </code>{" "}
              exists.
            </p>
            {this.state.error && (
              <p className="mt-2 text-[10px] font-mono text-[#9a8f7e] break-all">
                {this.state.error.message}
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
