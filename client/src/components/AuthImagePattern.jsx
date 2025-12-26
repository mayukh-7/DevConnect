const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12 relative overflow-hidden">
      {/* Background decoration - Abstract soft gradient blobs for depth, but kept subtle */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5 z-0" />
      
      {/* Animated Grid Pattern */}
      <div className="grid grid-cols-3 gap-4 max-w-lg w-full relative z-10 opacity-60">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className={`aspect-square rounded-3xl bg-primary/10 transition-all duration-1000 ${
              i % 2 === 0 ? "animate-pulse" : "hover:bg-primary/20"
            }`}
          />
        ))}
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-base-200 via-base-200/90 to-transparent z-20 text-center">
         <h2 className="text-3xl font-bold mb-4 tracking-tight text-base-content">{title}</h2>
         <p className="text-base-content/60 text-lg leading-relaxed">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;