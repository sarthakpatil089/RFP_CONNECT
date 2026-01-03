import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; role: string }>({
    id: "1234",
    role: "buyers",
  });
  const { isLoggedIn, logout, isVendor } = useAuth();
  const naviate = useNavigate();

  const handleLogout = () => {
    logout?.();
    setProfileMenuOpen(false);
    naviate("/");
  };
  useEffect(() => {
    const id = localStorage.getItem("id") || "1234";
    const role = isVendor ? "vendors" : "buyers";
    setUser({ id, role });
  }, [isVendor]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-textprimary/10">
      <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="font-heading text-xl font-bold text-textprimary hover:text-primary transition-colors"
          >
            RFP_CONNECT
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {isLoggedIn && (
              <>
                {" "}
                {!isVendor && (
                  <Link
                    to="/vendors"
                    className="font-paragraph text-sm text-textprimary hover:text-primary transition-colors"
                  >
                    Vendors
                  </Link>
                )}
                {isVendor && (
                  <Link
                    to="/buyers"
                    className="font-paragraph text-sm text-textprimary hover:text-primary transition-colors"
                  >
                    Buyers
                  </Link>
                )}
              </>
            )}
            {!isLoggedIn && (
              <>
                <Link
                  to="/vendor-register"
                  className="font-paragraph text-sm text-textprimary hover:text-primary transition-colors"
                >
                  Vendor Registration
                </Link>
                <Link
                  to="/buyer-register"
                  className="font-paragraph text-sm text-textprimary hover:text-primary transition-colors"
                >
                  Buyer Registration
                </Link>
              </>
            )}
            {!isVendor && isLoggedIn && (
              <Link
                to="/rfp-matching"
                className="font-paragraph text-sm text-textprimary hover:text-primary transition-colors"
              >
                RFP Matching
              </Link>
            )}
          </nav>

          {/* Right side: CTA + Profile / Login */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn && (
              <>
                {/* CTA */}
                {!isVendor && (
                  <Link
                    to="/rfp-submit"
                    className="font-paragraph text-sm px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    {"{ Submit RFP → }"}
                  </Link>
                )}

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2 px-3 py-2 border border-textprimary/20 rounded-md hover:border-primary hover:text-primary transition-colors"
                  >
                    <User size={18} />
                    <ChevronDown size={16} />
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-background border border-textprimary/10 rounded-md shadow-lg py-1 z-50">
                      <Link
                        to={`${user.role}/${user.id}`}
                        className="block w-full text-left px-4 py-2 text-sm text-textprimary hover:bg-textprimary/5"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        type="button"
                        className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {!isLoggedIn && (
              <Link
                to="/login"
                className="font-paragraph text-sm px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {"{ Login → }"}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-textprimary hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-textprimary/10">
            <nav className="flex flex-col gap-4">
              {isLoggedIn && (
                <>
                  {" "}
                  {!isVendor && (
                    <Link
                      to="/vendors"
                      className="font-paragraph text-sm text-textprimary hover:text-primary transition-colors"
                    >
                      Vendors
                    </Link>
                  )}
                  {isVendor && (
                    <Link
                      to="/buyers"
                      className="font-paragraph text-sm text-textprimary hover:text-primary transition-colors"
                    >
                      Buyers
                    </Link>
                  )}
                </>
              )}

              {!isLoggedIn && (
                <>
                  <Link
                    to="/vendor-register"
                    className="font-paragraph text-sm text-textprimary hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Vendor Registration
                  </Link>
                  <Link
                    to="/buyer-register"
                    className="font-paragraph text-sm text-textprimary hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Buyer Registration
                  </Link>
                  <Link
                    to="/login"
                    className="font-paragraph text-sm px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors inline-block text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {"{ Login → }"}
                  </Link>
                </>
              )}

              {isLoggedIn && (
                <>
                  {!isVendor && (
                    <Link
                      to="/rfp-submit"
                      className="font-paragraph text-sm px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      {"{ Submit RFP → }"}
                    </Link>
                  )}
                  <Link
                    to={`${user.role}/${user.id}`}
                    className="font-paragraph text-sm text-textprimary hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    className="font-paragraph text-sm text-destructive text-left"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
