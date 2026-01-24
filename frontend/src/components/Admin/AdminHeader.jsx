const AdminHeader = () => {
  return (
    <header
      className="
        h-16 w-full
        flex items-center justify-between
        bg-white
        border-b border-gray-200
        shadow-sm
        px-6
        sticky top-0 z-40
      "
    >
      {/* LEFT: Logo */}
      <div className="text-2xl font-bold tracking-wide">
        Strift
      </div>

      {/* CENTER: Search */}
      <div className="flex-1 flex justify-center">
        <input
          type="text"
          placeholder="Search for Products"
          className="
            w-[420px] px-4 py-2
            border rounded-full
            focus:outline-none focus:ring-2 focus:ring-black
            transition
          "
        />
      </div>

      {/* RIGHT: Actions */}
      <div className="flex gap-6 mr-[30px] text-gray-600 font-medium">
        <span className="cursor-pointer hover:text-black transition">Login</span>
        <span className="cursor-pointer hover:text-black transition">Cart</span>
        <span className="cursor-pointer hover:text-black transition">Contact</span>
      </div>
    </header>
  );
};

export default AdminHeader;
