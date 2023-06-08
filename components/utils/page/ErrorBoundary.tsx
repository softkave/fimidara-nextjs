import { cx } from "@emotion/css";
import React from "react";
import { appClasses } from "../theme";
import PageError from "./PageError";

export interface IErrorBoundaryProps {
  className?: string;
  children?: React.ReactNode;
}

class ErrorBoundary extends React.Component<IErrorBoundaryProps> {
  state: { error?: Error; errorInfo?: React.ErrorInfo } = {};

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // TODO: log error to server
    if (process.env.NODE_ENV === "development") {
      console.error(error);
      console.log(errorInfo);
    }
    this.setState({ error, errorInfo });
  }

  render(): React.ReactNode {
    const { className, children } = this.props;
    const { error } = this.state;

    if (error) {
      return (
        <div className={cx(appClasses.main, className)}>
          <PageError message="An error occurred, please reload the page to continue." />
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
