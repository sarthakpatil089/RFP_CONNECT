import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import { BaseCrudService } from '@/integrations';
import { Buyers } from "../../entities";
import { motion } from "framer-motion";
import {
  Search,
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
} from "lucide-react";
import LoadingSpinner from "../ui/LoadingSpinner";
import { getBuyers } from "../../services/buyerApi";
import { useToast } from "../../context/toastContext";

export default function BuyersPage() {
  const [buyers, setBuyers] = useState<Buyers[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    loadBuyers();
  }, []);

  const loadBuyers = async () => {
    setLoading(true);
    try {
      const { data, success } = await getBuyers();
      if (success) {
        setBuyers(data);
      } else {
        throw new Error("Failed to fetch buyers");
      }
    } catch (error: unknown) {
      addToast("Failed to fetch buyers", "error");
      console.error(error);
    }
    setLoading(false);
  };

  const filteredBuyers = buyers.filter(
    (buyer) =>
      buyer.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.emailAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-32 pb-24">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="font-heading text-5xl lg:text-6xl font-bold text-textprimary mb-6">
              Registered Buyers
            </h1>
            <p className="font-paragraph text-base text-textprimary/70 max-w-3xl">
              Browse our network of verified buyers and their procurement needs.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-textprimary/40 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by buyer name, email, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-textprimary/20 font-paragraph text-base focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-24">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredBuyers.map((buyer, index) => (
                <motion.div
                  key={buyer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link
                    to={`/buyers/${buyer.id}`}
                    className="block border-2 border-textprimary/10 p-8 hover:border-primary transition-colors h-full"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <User className="w-10 h-10 text-primary" />
                        <div>
                          <h2 className="font-heading text-xl font-semibold text-textprimary">
                            {`${buyer.firstName} ${buyer.lastName}` ||
                              "Unnamed Buyer"}
                          </h2>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        {buyer.isEmailVerified ? (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-primary" />
                            <span className="font-paragraph text-xs text-primary">
                              Email
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <XCircle className="w-4 h-4 text-textprimary/30" />
                            <span className="font-paragraph text-xs text-textprimary/40">
                              Email
                            </span>
                          </div>
                        )}
                        {false ? (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-primary" />
                            <span className="font-paragraph text-xs text-primary">
                              Phone
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <XCircle className="w-4 h-4 text-textprimary/30" />
                            <span className="font-paragraph text-xs text-textprimary/40">
                              Phone
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {buyer.emailAddress && (
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-primary" />
                          <span className="font-paragraph text-sm text-textprimary/70">
                            {buyer.emailAddress}
                          </span>
                        </div>
                      )}
                      {buyer.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-primary" />
                          <span className="font-paragraph text-sm text-textprimary/70">
                            {buyer.phone}
                          </span>
                        </div>
                      )}
                      {buyer.address && (
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-primary mt-1" />
                          <span className="font-paragraph text-sm text-textprimary/70">
                            {buyer.address}, {buyer.city}, {buyer.country}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && filteredBuyers.length === 0 && (
            <div className="text-center py-24">
              <p className="font-paragraph text-base text-textprimary/60">
                No buyers found matching your search criteria.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
