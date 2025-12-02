import { useState } from "react";

interface Props {
  appointmentId: number;
  onClick: () => void;
}

const DeleteAppoinmentButton: React.FC<Props> = ({
  appointmentId,
  onClick,
}) => {
  const [confirm, setConfirm] = useState(false);

  function handleConfirmation() {
    setConfirm(true);
  }

  async function handleDelete() {
    fetch(`/api/appointments/${appointmentId}/delete`, {
      method: "DELETE",
      credentials: "include",
    })
      .then(() => {
        console.log("Eliminado");
        onClick();
      })
      .catch((e) => {
        console.log("error", e);
      });
  }

  return (
    <>
      <button
        onClick={handleConfirmation}
        className="px-4 py-2 bg-red-600 rounded-md text-white"
      >
        Cancelar cita
      </button>

      {confirm && (
        <section className="absolute top-0 left-0 flex items-center justify-center w-full h-full rounded-md bg-black bg-opacity-40">
          <div className="bg-white rounded-md h-1/3 w-1/4 p-4">
            <h1 className="text-2xl p-2 mb-2 rounded-t-md border-b-2 border-gray-200">
              ¿Segura de eliminar esta cita?
            </h1>
            <div className="flex flex-col px-5 gap-4 text-lg text-center">
              <p>
                Esta accción es permanente y no podrá ser revertida en un futuro
              </p>
            </div>
            <div className="flex justify-between mt-10">
              <button
                className="bg-gray-200 rounded-md hover:bg-gray-300 text-xl py-2 px-10"
                onClick={() => setConfirm(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-red-600 rounded-md hover:bg-red-700 text-white text-xl py-2 px-10"
                onClick={handleDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default DeleteAppoinmentButton;
