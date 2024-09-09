export default function Features() {
  return (
    <div className="space-y-4">
      <h4 className="text-2xl">Features</h4>
      <div className="grid gap-x-4 gap-y-8 grid-cols-1 md:grid-cols-3">
        <div>Store files using the UI and API</div>
        <div>
          Implement simple and complex access controls using agent tokens and
          permission groups
        </div>
        <div>
          Build clients that securely access files without going through your
          servers
        </div>
      </div>
    </div>
  );
}
