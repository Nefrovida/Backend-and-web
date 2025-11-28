import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddPatientToForum from "../organism/forums/add_patient_to_forum";

function AddPatientToForumPage() {
  const navigate = useNavigate();
  const { forumId } = useParams<{ forumId: string }>();

  const handleSuccess = () => {
    // Redirect to the forum page after a short delay
    setTimeout(() => {
      navigate(`/forums/${forumId}`);
    }, 2000);
  };

  const handleCancel = () => {
    // Go back to the forum page
    navigate(`/forums/${forumId}`);
  };

  if (!forumId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Error: Foro no especificado
          </h2>
          <button
            onClick={() => navigate("/forums")}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Volver a Foros
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(180deg, #A8C5DD 0%, #1E3A8A 100%)",
      }}
    >
      <AddPatientToForum
        forumId={parseInt(forumId)}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default AddPatientToForumPage;