"use client";
export function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container text-center">
        <p className="mb-0">&copy; {new Date().getFullYear()} DeliverySystem. All rights reserved.</p>
      </div>
    </footer>
  );
}
