import { Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";

export default function Footer() {
  const { isLoggedIn, isVendor } = useAuth();

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="max-w-[120rem] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-4">RFP_CONNECT</h3>
            <p className="font-paragraph text-sm text-secondary-foreground/80">
              Streamlining vendor-buyer connections through intelligent RFP
              matching.
            </p>
          </div>

          {/* For Vendors */}
          <div>
            <h4 className="font-heading text-base font-semibold mb-4">
              For Vendors
            </h4>
            <ul className="space-y-3">
              {!isLoggedIn && (
                <li>
                  <Link
                    to="/vendor-register"
                    className="font-paragraph text-sm text-secondary-foreground/80 hover:text-primary transition-colors"
                  >
                    Register Account
                  </Link>
                </li>
              )}
              {isLoggedIn && (
                <li>
                  <Link
                    to="/vendors"
                    className="font-paragraph text-sm text-secondary-foreground/80 hover:text-primary transition-colors"
                  >
                    View Vendors
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* For Buyers */}
          <div>
            <h4 className="font-heading text-base font-semibold mb-4">
              For Buyers
            </h4>
            <ul className="space-y-3">
              {!isLoggedIn && (
                <li>
                  <Link
                    to="/buyer-register"
                    className="font-paragraph text-sm text-secondary-foreground/80 hover:text-primary transition-colors"
                  >
                    Register Account
                  </Link>
                </li>
              )}
              {!isVendor && isLoggedIn && (
                <li>
                  <Link
                    to="/rfp-submit"
                    className="font-paragraph text-sm text-secondary-foreground/80 hover:text-primary transition-colors"
                  >
                    Submit RFP
                  </Link>
                </li>
              )}
              {isLoggedIn && (
                <li>
                  <Link
                    to="/buyers"
                    className="font-paragraph text-sm text-secondary-foreground/80 hover:text-primary transition-colors"
                  >
                    View Buyers
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* System */}
          <div>
            <h4 className="font-heading text-base font-semibold mb-4">
              System
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/rfp-matching"
                  className="font-paragraph text-sm text-secondary-foreground/80 hover:text-primary transition-colors"
                >
                  RFP Matching
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-secondary-foreground/20">
          <p className="font-paragraph text-sm text-secondary-foreground/60 text-center">
            © {new Date().getFullYear()} RFP_CONNECT. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
