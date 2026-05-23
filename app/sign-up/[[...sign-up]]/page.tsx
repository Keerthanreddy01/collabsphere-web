import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#080810]">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7A5BFF]/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-[#ec4899]/8 blur-[100px]" />
      {/* Subtle dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `radial-gradient(rgba(122,91,255,0.6) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />
      <div className="relative z-10">
        <SignUp />
      </div>
    </div>
  );
}
