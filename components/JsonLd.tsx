/**
 * Renders a JSON-LD structured-data script. `data` is a schema.org object (or
 * array of them). Safe because we control the input (no user HTML).
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
