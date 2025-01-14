export default function CustomEditableAction({ action }) {
  if (action === "SAVE") {
    return (
      <button className="p-1 text-sm rounded-lg flex items-center text-emerald-500 border border-emerald-500 bg-white hover:bg-emerald-500 hover:text-white transition ease-in-out duration-200">
        Save
      </button>
    );
  }
  return (
    <button className="p-1 text-sm rounded-lg flex items-center text-red-500 border border-red-500 bg-white hover:bg-red-500 hover:text-white transition ease-in-out duration-200">
      Cancel
    </button>
  );
}
