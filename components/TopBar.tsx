export default function TopBar() {
  return (
    <div className="bg-[#2563eb] text-white text-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2 flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <span className="whitespace-nowrap font-medium">Extra Discount On Online Payment</span>
            <select className="bg-[#2563eb] text-white border-none outline-none cursor-pointer font-medium">
              <option>EN</option>
            </select>
          </div>
          <div className="flex items-center gap-3 md:gap-4 flex-wrap">
            <a href="#" className="hover:underline whitespace-nowrap text-xs md:text-sm font-medium">Sell with us</a>
            <a href="#" className="hover:underline whitespace-nowrap text-xs md:text-sm font-medium">Seller Login</a>
            <a href="#" className="hover:underline whitespace-nowrap text-xs md:text-sm font-medium hidden sm:inline">Be a Partner</a>
            <a href="#" className="hover:underline whitespace-nowrap text-xs md:text-sm font-medium hidden sm:inline">Ask Agro Experts</a>
          </div>
        </div>
      </div>
    </div>
  );
}

