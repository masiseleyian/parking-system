export function ParkingLogo({ light = false, large = false, caption }: { light?: boolean; large?: boolean; caption?: string }) {
  return (
    <span className="inline-flex items-center gap-3">
      <span aria-hidden="true" className={`grid shrink-0 place-items-center rounded-xl bg-[#2563eb] font-bold leading-none text-white ${large ? "size-12 text-[29px]" : "size-10 text-[24px]"}`}>P</span>
      <span>
        <strong className={`block font-bold tracking-tight ${large ? "text-lg" : "text-[17px]"} ${light ? "text-white" : "text-[#172b24]"}`}>Smart Parking</strong>
        {caption && <span className={`block text-[11px] ${light ? "text-[#a6c5b3]" : "text-[#607268]"}`}>{caption}</span>}
      </span>
    </span>
  );
}
