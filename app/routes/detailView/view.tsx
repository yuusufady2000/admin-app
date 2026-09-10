import { useEffect, useState } from "react";
import type { User } from "../../../typ";
import { Link, useParams } from "react-router";

const View = () => {
  const { id } = useParams();

  const [view, setView] = useState<User | null>(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectMessage, setRejectMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const fetchDetail = async () => {
    try {
      const res = await fetch(
        `https://admin-app-1-se24.onrender.com/User/${id}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch application");
      }

      const data = await res.json();

      setView(data);
    } catch (error) {
      console.error("Error fetching application:", error);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleAccept = async () => {
    if (!view) return;

    try {
      setLoading(true);

      const approvedUser = {
        ...view,
        status: "accepted",
      };

      const approvedRes = await fetch(
        "https://admin-app-1-se24.onrender.com/Approveds",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(approvedUser),
        }
      );

      if (!approvedRes.ok) {
        throw new Error("Failed to add user to Approveds");
      }

      const userRes = await fetch(
        `https://admin-app-1-se24.onrender.com/User/${view.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "accepted",
          }),
        }
      );

      if (!userRes.ok) {
        throw new Error("Failed to update user status");
      }

      const updatedUser = await userRes.json();

      setView(updatedUser);
      setConfirmModal(false);
      setSuccessModal(true);
    } catch (error) {
      console.error("Error accepting application:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    setSuccessModal(false);
  };

  const handleReject = async () => {
    if (!view || !rejectMessage.trim()) return;

    try {
      setLoading(true);

      const res = await fetch(
        `https://admin-app-1-se24.onrender.com/User/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "rejected",
            rejectionMessage: rejectMessage,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to reject application");
      }

      const updatedApplication = await res.json();

      setView(updatedApplication);
      setShowRejectModal(false);
      setRejectMessage("");
    } catch (error) {
      console.error("Error rejecting application:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!view) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="text-sm text-gray-500">
            Loading User detail...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-5xl">

        <Link
          to="/"
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Back to home
        </Link>

        <div className="mb-8 mt-6">

          <p className="text-sm font-medium text-blue-600">
            Seller Management
          </p>

          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h1 className="text-3xl font-bold text-gray-900">
                Seller Application
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Review the seller's application and make a decision.
              </p>

            </div>

            <span
              className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold ${
                view.status === "accepted"
                  ? "bg-green-100 text-green-700"
                  : view.status === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {view.status
                ? view.status.charAt(0).toUpperCase() +
                  view.status.slice(1)
                : "Pending"}
            </span>

          </div>

        </div>

        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">

          <div className="border-b border-gray-100 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 sm:px-8">

            <div className="flex items-center gap-4">

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl font-bold text-blue-600 shadow-sm">
                {view.name?.charAt(0).toUpperCase()}
              </div>

              <div>

                <h2 className="text-xl font-bold text-white">
                  {view.name}
                </h2>

                <p className="mt-1 text-sm text-blue-100">
                  {view.email}
                </p>

              </div>

            </div>

          </div>

          <div className="p-6 sm:p-8">

            <section>

              <h3 className="mb-5 text-lg font-bold text-gray-900">
                Personal Information
              </h3>

              <div className="grid gap-5 sm:grid-cols-2">

                <InfoItem
                  label="Full Name"
                  value={view.name}
                />

                <InfoItem
                  label="Email Address"
                  value={view.email}
                />

                <InfoItem
                  label="Phone Number"
                  value={view.phoneNumber}
                />

                <InfoItem
                  label="Birth Date"
                  value={String(view.birthDate)}
                />

              </div>

            </section>

            <div className="my-8 border-t border-gray-100" />

            <section>

              <h3 className="mb-5 text-lg font-bold text-gray-900">
                Business Information
              </h3>

              <div className="grid gap-5 sm:grid-cols-2">

                <InfoItem
                  label="Store Name"
                  value={view.storeName}
                />

                <InfoItem
                  label="Business Category"
                  value={view.businessCategory}
                />

                <InfoItem
                  label="Country"
                  value={view.country}
                />

                <InfoItem
                  label="City"
                  value={view.city}
                />

                <div className="sm:col-span-2">

                  <InfoItem
                    label="Business Address"
                    value={view.address}
                  />

                </div>

              </div>

            </section>

            {view.status === "rejected" &&
              view.rejectionMessage && (
                <>
                  <div className="my-8 border-t border-gray-100" />

                  <div className="rounded-2xl border border-red-100 bg-red-50 p-5">

                    <p className="text-sm font-semibold text-red-700">
                      Rejection Message
                    </p>

                    <p className="mt-2 text-sm leading-6 text-red-600">
                      {view.rejectionMessage}
                    </p>

                  </div>
                </>
              )}

            {view.status !== "accepted" &&
              view.status !== "rejected" && (
                <div className="mt-10 flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={() => setShowRejectModal(true)}
                    disabled={loading}
                    className="rounded-xl border border-red-200 bg-white px-6 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Reject Application
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfirmModal(true)}
                    disabled={loading}
                    className="rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading
                      ? "Processing..."
                      : "Accept Application"}
                  </button>

                </div>
              )}

          </div>

        </div>

      </div>

      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8">

            <div className="mb-6">

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">

                <span className="text-xl text-green-600">
                  !
                </span>

              </div>

              <h2 className="text-xl font-bold text-gray-900">
                Approve Application
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Are you sure you want to approve this seller application?
              </p>

            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() => setConfirmModal(false)}
                disabled={loading}
                className="rounded-xl bg-gray-100 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAccept}
                disabled={loading}
                className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Accepting..."
                  : "Confirm Approval"}
              </button>

            </div>

          </div>

        </div>
      )}

      {successModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4">

          <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">

            <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-green-100">

              <span className="text-8xl font-bold leading-none text-green-600">
                ✓
              </span>

            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              Application Approved!
            </h2>

            <p className="mt-4 text-base leading-7 text-gray-600">
              The seller application has been successfully approved.
            </p>

            <button
              type="button"
              onClick={handleDone}
              className="mt-7 w-full rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Done
            </button>

          </div>

        </div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8">

            <div className="mb-6">

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">

                <span className="text-xl text-red-600">
                  !
                </span>

              </div>

              <h2 className="text-xl font-bold text-gray-900">
                Reject Application
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Please provide a reason for rejecting this seller application.
              </p>

            </div>

            <div>

              <label
                htmlFor="rejectMessage"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Rejection Message
              </label>

              <textarea
                id="rejectMessage"
                value={rejectMessage}
                onChange={(e) =>
                  setRejectMessage(e.target.value)
                }
                rows={5}
                placeholder="Enter the reason for rejection..."
                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />

            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectMessage("");
                }}
                disabled={loading}
                className="rounded-xl bg-gray-100 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleReject}
                disabled={
                  loading || !rejectMessage.trim()
                }
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Rejecting..."
                  : "Confirm Rejection"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <div className="rounded-xl bg-gray-50 p-4">

      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-semibold text-gray-900">
        {value || "Not provided"}
      </p>

    </div>
  );
};

export default View;