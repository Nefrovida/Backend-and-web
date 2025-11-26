interface Props{
    appointmentId: number
}

const DeleteAppoinmentButton: React.FC<Props> = ({appointmentId}) => {
    async function handleDelete(){
        console.log("probando")
        fetch(`/api/appointments/${appointmentId}/delete`,{
            method: "DELETE",
        credentials: "include"})
        .then(()=> console.log("probando")) 
        .catch(e =>{console.log("error", e)})
    }

    return(
        
        <button
        onClick={handleDelete}
        className="px-4 py-2 bg-red-600 rounded-md text-white"

        >
                Cerrar
        </button>

        /*
        <button
        className="mt-3 bg-primary text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(request);
        }}
      >
        Agendar Cita
      </button>
    </div>
        */
    )
}

export default DeleteAppoinmentButton