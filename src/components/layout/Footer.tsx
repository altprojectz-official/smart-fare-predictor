

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/Logo.png"
              alt="ML Smart Pricing System Logo"
              className="h-7 w-auto object-contain"
            />
            <span className="font-bold text-lg">
              ML Smart Pricing System
            </span>
          </div>

          <div className="text-sm text-muted-foreground font-medium">
            Developed By – I. Mohamed Arshath • 2024–27
          </div>
        </div>
      </div>
    </footer >
  );
};

export default Footer;
