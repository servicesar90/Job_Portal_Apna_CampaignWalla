import { useEffect, useState } from "react";
import { getTransactionHistory } from "../../services/paymentService";
import toast from "react-hot-toast";

interface Transaction {
  _id: string;
  job?: { title: string };
  amount: number;
  currency: string;
  provider: string;
  providerOrderId?: string;
  providerPaymentId?: string;
  status: "created" | "paid" | "failed" | "refunded";
  createdAt: string;
  meta?: any;
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getTransactionHistory();
        if (res.data.success) {
          setTransactions(res.data.transactions);
          toast.success("Transactions loaded successfully");
        }
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-20">
        <span className="text-gray-500 text-lg">Loading transactions...</span>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex justify-center items-center mt-20">
        <span className="text-gray-500 text-lg">No transactions found.</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-6">Transaction History</h2>
      <div className="overflow-x-auto bg-white shadow-xl rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Provider</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((t) => {
              // Determine frontend status
              const frontendStatus =
                t.status === "paid" && t.providerPaymentId ? "SUCCESS" : "FAIL";
              return (
                <tr key={t._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(t.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {t.job?.title || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {t.currency} {t.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{t.provider}</td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      frontendStatus === "SUCCESS" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {frontendStatus}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {t.providerPaymentId || "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
