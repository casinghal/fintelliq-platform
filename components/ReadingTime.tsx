export function ReadingTime({ minutes }: { minutes: number }) {
  return (
    <span className="text-body-s text-text-muted">
      {minutes} min read
    </span>
  );
}
