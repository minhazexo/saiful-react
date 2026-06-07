export default function Deco({ children, label }) {
  if (label) {
    return (
      <span role="img" aria-label={label}>
        {children}
      </span>
    );
  }
  return <span aria-hidden="true">{children}</span>;
}
