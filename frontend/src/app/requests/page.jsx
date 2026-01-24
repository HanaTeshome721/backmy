"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import ImagePreviewModal from "@/components/ImagePreviewModal";
import ImageCarousel from "@/components/ImageCarousel";
import { useLanguage } from "@/contexts/language-context";

export default function RequestsPage() {
  const { t } = useLanguage();
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [needIncoming, setNeedIncoming] = useState([]);
  const [needOutgoing, setNeedOutgoing] = useState([]);
  const [message, setMessage] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  const loadRequests = async () => {
    try {
      const inData = await apiFetch("/requests/incoming");
      const outData = await apiFetch("/requests/outgoing");
      setIncoming(inData?.data || []);
      setOutgoing(outData?.data || []);

      const needIn = await apiFetch("/needs/offers/incoming");
      const needOut = await apiFetch("/needs/offers/outgoing");
      setNeedIncoming(needIn?.data || []);
      setNeedOutgoing(needOut?.data || []);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleDecision = async (id, action) => {
    setMessage("");
    try {
      await apiFetch(`/requests/${id}/${action}`, { method: "PUT" });
      await loadRequests();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleConfirm = async (id) => {
    setMessage("");
    try {
      await apiFetch(`/requests/${id}/confirm`, { method: "PUT" });
      await loadRequests();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleNeedDecision = async (id, action) => {
    setMessage("");
    try {
      await apiFetch(`/needs/offers/${id}/${action}`, { method: "PUT" });
      await loadRequests();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleNeedConfirm = async (id) => {
    setMessage("");
    try {
      await apiFetch(`/needs/offers/${id}/confirm`, { method: "PUT" });
      await loadRequests();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="space-y-6">
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{t("requests.donationTitle")}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-base font-semibold">{t("requests.incoming")}</h3>
            <div className="space-y-3">
              {incoming.map((req) => (
                <div key={req._id} className="card space-y-2">
                  <div className="text-sm text-slate-600">
                    Item: {req.item?.title}
                  </div>
                  <div className="text-sm">From: {req.requester?.username}</div>
                  {req.evidenceImages?.length ? (
                    <ImageCarousel
                      images={req.evidenceImages}
                      alt="Evidence"
                      onImageClick={setPreviewImage}
                    />
                  ) : null}
                  {req.status === "approved" ? (
                    <div className="text-xs text-slate-500">
                      Contact: {req.requester?.fullName || req.requester?.username},{" "}
                      {req.requester?.phoneNumber || "N/A"},{" "}
                      {req.requester?.address || "N/A"}
                    </div>
                  ) : null}
                  <div className="status-text" data-status={(req.status || "").toLowerCase()}>
                    Status: {req.status}
                  </div>
                  {req.status === "pending" ? (
                    <div className="flex gap-2">
                      <button
                        className="btn-primary"
                        onClick={() => handleDecision(req._id, "approve")}
                      >
                        Approve
                      </button>
                      <button
                        className="btn-outline"
                        onClick={() => handleDecision(req._id, "reject")}
                      >
                        Reject
                      </button>
                    </div>
                  ) : null}
                  {req.status === "approved" && !req.ownerContactSharedAt ? (
                    <button className="btn-outline" onClick={() => handleConfirm(req._id)}>
                      Share My Contact
                    </button>
                  ) : null}
                  {req.ownerContactSharedAt ? (
                    <p className="text-xs text-slate-400">
                      Contact shared with requester.
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold">{t("requests.outgoing")}</h3>
            <div className="space-y-3">
              {outgoing.map((req) => (
                <div key={req._id} className="card space-y-1">
                  <div className="text-sm text-slate-600">
                    Item: {req.item?.title}
                  </div>
                  <div className="text-sm">Owner: {req.owner?.username}</div>
                  <div className="status-text" data-status={(req.status || "").toLowerCase()}>
                    Status: {req.status}
                  </div>
                  {req.evidenceImages?.length ? (
                    <ImageCarousel
                      images={req.evidenceImages}
                      alt="Evidence"
                      onImageClick={setPreviewImage}
                    />
                  ) : null}
                  {req.ownerContactSharedAt ? (
                    <div className="text-xs text-slate-500">
                      Owner contact: {req.owner?.fullName || req.owner?.username},{" "}
                      {req.owner?.phoneNumber || "N/A"},{" "}
                      {req.owner?.address || "N/A"}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3 mt-6">
        <h2 className="text-lg font-semibold">{t("requests.requestsTitle")}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-base font-semibold">{t("requests.incomingOffers")}</h3>
            <div className="space-y-3">
              {needIncoming.map((offer) => (
                <div key={offer._id} className="card space-y-2">
                  <div className="text-sm text-slate-600">
                    Request: {offer.need?.title}
                  </div>
                  <div className="text-sm">From donor: {offer.donor?.username}</div>
                  <p className="text-sm text-slate-600">
                    Message: {offer.message || "No message"}
                  </p>
                  {offer.status === "approved" ? (
                    <div className="text-xs text-slate-500">
                      Donor contact: {offer.donor?.fullName || offer.donor?.username},{" "}
                      {offer.donor?.phoneNumber || "N/A"},{" "}
                      {offer.donor?.address || "N/A"}
                    </div>
                  ) : null}
                  <div className="status-text" data-status={(offer.status || "").toLowerCase()}>
                    Status: {offer.status}
                  </div>
                  {offer.status === "pending" ? (
                    <div className="flex gap-2">
                      <button
                        className="btn-primary"
                        onClick={() => handleNeedDecision(offer._id, "approve")}
                      >
                        Approve
                      </button>
                      <button
                        className="btn-outline"
                        onClick={() => handleNeedDecision(offer._id, "reject")}
                      >
                        Reject
                      </button>
                    </div>
                  ) : null}
                  {offer.status === "approved" && !offer.requesterContactSharedAt ? (
                    <button className="btn-outline" onClick={() => handleNeedConfirm(offer._id)}>
                      Share My Contact
                    </button>
                  ) : null}
                  {offer.requesterContactSharedAt ? (
                    <p className="text-xs text-slate-400">
                      Contact shared with donor.
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold">{t("requests.outgoingOffers")}</h3>
            <div className="space-y-3">
              {needOutgoing.map((offer) => (
                <div key={offer._id} className="card space-y-1">
                  <div className="text-sm text-slate-600">
                    Request: {offer.need?.title}
                  </div>
                  <div className="text-sm">Requester: {offer.requester?.username}</div>
                  <div className="status-text" data-status={(offer.status || "").toLowerCase()}>
                    Status: {offer.status}
                  </div>
                  {offer.requesterContactSharedAt ? (
                    <div className="text-xs text-slate-500">
                      Requester contact: {offer.requester?.fullName || offer.requester?.username},{" "}
                      {offer.requester?.phoneNumber || "N/A"},{" "}
                      {offer.requester?.address || "N/A"}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <ImagePreviewModal
        src={previewImage}
        alt="Evidence"
        onClose={() => setPreviewImage("")}
      />
    </div>
  );
}
