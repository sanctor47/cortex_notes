const SideDrawer = ({ children, isOpen, lg = true }) => {
  const overlayClasses = isOpen
  ? "fixed inset-0 flex  z-50 bg-black bg-opacity-50"
  : "hidden";
const drawerClasses = isOpen
  ? `absolute h-screen top-0 right-0 ${lg?"w-[380px]":"w-[280px]"}`
  : "hidden";
return (
  <div className={overlayClasses}>
    <div className={drawerClasses}>{children}</div>
  </div>
);
}

export default SideDrawer