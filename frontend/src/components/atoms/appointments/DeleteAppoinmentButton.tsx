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
        <section className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black/50">
          <div className="bg-white rounded-md h-auto w-1/4 shadow-lg"> 
            <h1 className="bg-[#010C5E] text-white text-xl font-semibold p-2 mb-2 rounded-t-md">
              ¿Segura de eliminar esta cita?
            </h1>
            <div className="flex flex-col px-5 py-4 gap-4 text-lg">
              <p className="text-gray-700 text-base">
                Esta acción no puede ser revertida. Confirma si deseas eliminar esta cita.
              </p>
              <div className="flex justify-around">
                <button
                  className="bg-gray-200 rounded-md hover:bg-gray-300 w-1/3 py-2 text-base font-medium"
                  onClick={() => setConfirm(false)}
                >
                  No
                </button>
                <button
                  className="bg-red-600 rounded-md hover:bg-red-700 text-white w-1/3 py-2 text-base font-medium"
                  onClick={handleDelete}
                >
                  Sí
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default DeleteAppoinmentButton;
