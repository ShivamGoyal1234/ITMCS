interface ClarificationBannerProps {
  message: string;
}

export function ClarificationBanner({ message }: ClarificationBannerProps) {
  return (
    <div className="banner banner-clarification">
      <strong>More details needed.</strong> {message}
    </div>
  );
}

interface ErrorBannerProps {
  errorCode: string | null;
  message: string;
}

export function ErrorBanner({ errorCode, message }: ErrorBannerProps) {
  return (
    <div className="banner banner-error">
      <strong>{errorCode ?? "Error"}.</strong> {message}
    </div>
  );
}
